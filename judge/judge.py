import sys, time, os, subprocess, threading
import daemon
import MySQLdb.cursors

OUTPUT_LIMIT = 51200*1024
STACK_SIZE = 8192*1024
SRC_PATH = "/data/coda/src/"
LANG_SUFFIX = {
  0: ".cpp"
}
STATUS_CODES = {
  'pending': 0,
  'compiling': 1,
  'running': 2,
  'complete': 3
}
VERDICT_CODES = {
  'AC': 0,
  'WA': 1,
  'RE': 2,
  'TLE': 3,
  'MLE': 4,
  'OLE': 5,
  'CE': 6,
  'SE': 10
}

# run judge as daemon
#with daemon.DaemonContext(stderr=sys.stderr):
#  while True:
#    time.sleep(1)

class DB:
  def __init__ (self):
    self.isConnected = False
    self.db = None
  def connect(self):
    self.db = MySQLdb.connect(host="localhost", 
                     user="coda", 
                     passwd="coda", 
                     db="codadb",
                     cursorclass=MySQLdb.cursors.DictCursor)
    self.cur = self.db.cursor()
    self.isConnected = True
  def disconnect(self):
    self.cur.close()
    self.db.close()
    self.isConnected = False
  def execute(self, query):
    self.cur.execute(query)
    return self.cur.fetchall()
  def executeOne(self, query):
    self.cur.execute(query)
    return self.cur.fetchone()


def judge(db, sub, prob):
  sub_id = str(sub['id'])
  
  def compile(lang, src):
    if lang == 0:
      with open('/sandbox/compiler_out', 'w', 0) as cout:
        ret = subprocess.call(["g++", "-o", "/sandbox/program", src], stderr=cout)
        if ret != 0:
          sys.stderr.write("compilation error\n")
        else:
          sys.stderr.write("compilation succeeded\n")
        return ret
    return -1
  
  def set_status(status):
    db.execute("UPDATE submissions SET status=" + str(STATUS_CODES[status]) + " WHERE id=" + sub_id)
  
  def complete(verdict):
    db.execute("UPDATE submissions SET status=" + str(STATUS_CODES['complete'])
      + ", " + "verdict=" + str(VERDICT_CODES[verdict]) + " WHERE id=" + sub_id)
    db.execute("DELETE FROM judge_queue WHERE id=" + sub_id)
  
  
  # judging starts here
  sys.stdout.write("Judging <" + prob['name'] + "> for sub #" + sub_id + "...\n")
  
  
  # compile the src, status <- compling
  set_status('compiling')
  src_path = SRC_PATH + sub_id + LANG_SUFFIX[sub['language']]
  cret = compile(sub['language'], src_path)
  # compilation error, move compiler msg to /coda/ce
  if cret != 0:
    if cret == -1:
      sys.stderr.write("unrecognized sub compiler" + sub['language'])
    else: 
      subprocess.Popen(["mv", "/sandbox/compiler_out", "/data/coda/ce/" + sub_id + ".ce"])
      # status <- complete
      complete('CE')
    return 
  
  # run user program
  set_status('running')
  inout_path, test_num = prob['inout_path'], prob['test_num']
  test_prefix = inout_path + str(prob['id']) + "_"
  for test_id in range(1, test_num+1):
    infile_path = test_prefix + str(test_id) + ".in"
    outfile_path = "/sandbox/" + sub_id + "_" + str(test_id) + ".out"
    lrunfile_path = "/sandbox/" + sub_id + "_" + str(test_id) + ".lrun"
    with open(infile_path, 'r') as infile:
      sys.stdout.write("Running test " + infile_path + "...\n")
      
      # TODO: lrun drops mysql connection
      args = ["lrun"]
      args += ["--max-cpu-time", str(prob['time_limit'] / 1000.0)]
      args += ["--max-memory", str(prob['memory_limit'] * 1024)]
      args += ["--max-output", str(OUTPUT_LIMIT)]
      args += ["--max-stack", str(STACK_SIZE)]
      args += ["--status"]
      
      args += ["/sandbox/program"]
      
      infile = open(infile_path, 'r')
      outfile = open(outfile_path, 'w')
      subprocess.call(["rm", lrunfile_path])
      
      # avoid fd 3 interrupting with db (hacky...)
      db.disconnect()
      
      # open a new fd for lrun, and dup it to fd 3 to capture lrun message
      fdlrun = os.open(lrunfile_path, os.O_RDWR | os.O_CREAT)
      os.dup2(fdlrun, 3)

      proc = subprocess.Popen(args,
        stdin=infile,
        stdout=outfile,
        stderr=subprocess.PIPE #sys.stderr
      )
      proc.communicate()
      
      # we now have lrun result in lrunfile
      lrunfile = open(lrunfile_path, 'r')
      result = lrunfile.read()
      # TODO: parse lrun result
      # TODO: run checker
      
      
      # reconnect db (hacky...)
      db.connect()
      
      # DEBUG: verify db is still okay
      db.execute("SELECT * from judge_queue")
      
  complete('AC')
  
def main():
  db = DB()
  db.connect()
  subs = db.execute("SELECT * FROM judge_queue")
  for row_queue in subs:
    # get submission
    sub_id = str(row_queue['id'])
    sub = db.executeOne("SELECT * FROM submissions WHERE id=" + sub_id)
    if len(sub) == 0:
      sys.stderr.write("cannot find judge queue sub #" + sub_id + " from submissions\n")
      continue
    # get problem
    prob_id = str(sub['problem_id'])
    prob = db.executeOne("SELECT * FROM problems WHERE id=" + prob_id)
    if len(prob) == 0:
      sys.stderr.write("cannot find judge queue prob #" + prob_id + " from problems\n")
    judge(db, sub, prob)
    break

if __name__ == "__main__":
  main()