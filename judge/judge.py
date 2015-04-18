import sys, time, os, subprocess

sys.path.append("..") # to import daemon from parent directory

import daemon
import MySQLdb.cursors

OUTPUT_LIMIT = 51200*1024
STACK_SIZE = 8192*1024
SRC_PATH = "/data/coda/src/"
CHECKER_TIME = 30.0
SNAPSHOT_SIZE = 500
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
  def commit(self):
    self.db.commit()
  def execute(self, query):
    self.cur.execute(query)
    return self.cur.fetchall()
  def execute_one(self, query):
    self.cur.execute(query)
    return self.cur.fetchone()
  def escape_string(self, s):
    return self.db.escape_string(s)


def judge(db, sub, prob):
  
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
    db.execute("UPDATE submissions SET status=%d WHERE id=%d" 
      % (STATUS_CODES[status], sub_id))
  
  def set_case(test_num, verdict, time=0, memory=0, sub_output="", checker_output=""):
    print >> sys.stdout, "case #%d: %s" % (test_num, verdict)
    sub_output = "'" + db.escape_string(sub_output) + "'"
    checker_output = "'" + db.escape_string(checker_output) + "'"
    values = [str(sub_id), str(test_num), 
      str(VERDICT_CODES[verdict]), str(time), str(memory), sub_output, checker_output]
    db.execute("INSERT INTO judge_results (sub_id, test_num, verdict, time, memory, sub_output, checker_output) "
      "VALUES (" + ','.join(values) + ")")
      
  def complete(verdict, last_test_num=0, time=0, time_total=0, memory=0):
    print >> sys.stdout, "sub result: %s" % verdict
    db.execute("UPDATE submissions SET status=%d, verdict=%d, last_test_num=%d, "
     "time=%d, time_total=%d, memory=%d WHERE id=%d"
      % (STATUS_CODES['complete'], VERDICT_CODES[verdict], last_test_num, 
      time, time_total, memory, sub_id) )
    # remove sub from judge queue
    db.execute("DELETE FROM judge_queue WHERE id=%d" % sub_id)
  
  
  sub_id = sub['id']
  
  # avoid fd 3 interrupting with db (hacky...)
  db.disconnect()
  fd3 = os.open("/sandbox/fd3", os.O_RDWR | os.O_CREAT)
  os.dup2(fd3, 3)
  db.connect()
  
  # judging starts here .................
  print >> sys.stdout, "Judging <%s> for sub #%d ..." % (prob['name'], sub_id)
  
  # compile the src, status <- compling
  set_status('compiling')
  src_path = SRC_PATH + str(sub_id) + LANG_SUFFIX[sub['language']]
  cret = compile(sub['language'], src_path)
  # compilation error, move compiler msg to /coda/ce
  if cret != 0:
    if cret == -1:
      print >> sys.stderr, "unrecognized sub compiler %d" % sub['language']
    else: 
      subprocess.Popen(["mv", "/sandbox/compiler_out", "/data/coda/ce/%d.ce" % sub_id])
      # status <- complete
      complete('CE')
    return 
  
  # copy checker to sandbox
  checker_path = prob['checker_path']
  try:
    subprocess.check_output(["cp", checker_path, "/sandbox"])
  except subprocess.CalledProcessError:
    print >> sys.stderr, "cannot cp checker %s" % checker_path
    complete('SE')
    return
  
  # run user program
  set_status('running')
  inout_path, test_num = prob['inout_path'], prob['test_num']
  test_prefix = inout_path + str(prob['id']) + "_"
  time_total, time_max, memory_max = 0, 0, 0
  
  for test_id in range(1, test_num+1):
    # remove previous results (possible rejudge)
    db.execute("DELETE FROM judge_results WHERE sub_id=%d AND test_num=%d" % (sub_id, test_id))
    
    sandbox_prefix = "/sandbox/%d_%d" % (sub_id, test_id)
    
    # problem inout files
    infile_path = test_prefix + str(test_id) + ".in"
    ansfile_path = test_prefix + str(test_id) + ".out"
    
    # files written in the sandbox path
    outfile_path = sandbox_prefix + ".out"
    lrunfile_path = sandbox_prefix + ".lrun"
    checkerfile_path = sandbox_prefix + ".checker"
    
    # begin case judge ...
    print >> sys.stdout, "Running test %s..." % infile_path
    
    args = ["lrun"]
    args += ["--max-cpu-time", str(prob['time_limit'] / 1000.0)]
    args += ["--max-memory", str(prob['memory_limit'] * 1024)]
    args += ["--max-output", str(OUTPUT_LIMIT)]
    args += ["--max-stack", str(STACK_SIZE)]
    args += ["/sandbox/program"]
    
    infile = open(infile_path, 'r')
    outfile = open(outfile_path, 'w')
    
    # open a new fd for lrun, and dup 3 to it to capture lrun message
    fdlrun = os.open(lrunfile_path, os.O_RDWR | os.O_CREAT)
    os.dup2(3, fdlrun)

    proc = subprocess.Popen(args,
      stdin=infile,
      stdout=outfile
    )
    proc.communicate()
    infile.close()
    outfile.close()
    
    # we now have lrun result in lrunfile
    lrunfile = open(lrunfile_path, 'r')
    result_tokens = lrunfile.read().split()
    lrunfile.close()
    result = {}
    for i in range(0,len(result_tokens),2):
      result[result_tokens[i]] = result_tokens[i + 1]
    # parse lrun result
    memory = int(result['MEMORY']) / 1024;
    time = int(float(result['CPUTIME']) * 1000);
    signaled = int(result['SIGNALED']);
    exceed = result['EXCEED'];
    
    time_max = max(time_max, time)
    memory_max = max(memory_max, memory)
    time_total += time
    
    if exceed == 'CPU_TIME':
      set_case(test_num=test_id, verdict='TLE', time=time, memory=memory) 
      complete('TLE', last_test_num=test_id, time=time_max, memory=memory_max)
    elif exceed == 'MEMORY':
      set_case(test_num=test_id, verdict='MLE', time=time, memory=memory) 
      complete('MLE', last_test_num=test_id, time=time_max, memory=memory_max)
    elif exceed == 'OUTPUT':
      set_case(test_num=test_id, verdict='OLE', time=time, memory=memory) 
      complete('OLE', last_test_num=test_id, time=time_max, memory=memory_max)
    
    if exceed != 'none':
      return # pass RE check
    
    if signaled == 1:
      set_case(test_num=test_id, verdict='RE', time=time, memory=memory)
      complete('RE', last_test_num=test_id, time=time_max, memory=memory_max)
      return # pass checker run
      
    # run checker
    args = ["lrun"]
    args += ["--max-cpu-time", str(CHECKER_TIME)]
    args += [checker_path, ansfile_path, outfile_path, checkerfile_path]
    proc = subprocess.Popen(args)
    
    # get checker result
    checkerfile = open(checkerfile_path, 'r')
    verdict = checkerfile.readline().rstrip()
    checker_output = checkerfile.read()
    checkerfile.close()
    
    # get user output
    outfile = open(outfile_path, 'r')
    sub_output = outfile.read()
    outfile.close()
    if len(sub_output) > SNAPSHOT_SIZE:
      sub_output = sub_output[:SNAPSHOT_SIZE] + " (...)"
    
    if verdict != 'AC':
      set_case(test_num=test_id, verdict='WA', time=time, memory=memory, 
        sub_output=sub_output, checker_output=checker_output)
      complete('WA', last_test_num=test_id, time=time_max, memory=memory_max)
      return
    
    set_case(test_num=test_id, verdict='AC', time=time, memory=memory, 
        sub_output=sub_output, checker_output=checker_output)
      
  complete('AC', last_test_num=test_id, time=time_max, time_total=time_total, memory=memory_max)


def main():
  db = DB()
  db.connect()
  
  subs = db.execute("SELECT * FROM judge_queue")
  for row_queue in subs:
    # get submission
    sub_id = row_queue['id']
    sub = db.execute_one("SELECT * FROM submissions WHERE id=%d" % sub_id)
    if len(sub) == 0:
      print >> sys.stderr, "cannot find judge queue sub #%d from submissions" % sub_id
      continue
    # get problem
    prob_id = sub['problem_id']
    prob = db.execute_one("SELECT * FROM problems WHERE id=%d" % prob_id)
    if len(prob) == 0:
      print >> sys.stderr, "cannot find judge queue prob #%d from problems" % prob_id
      continue
    judge(db, sub, prob)
    db.commit()
  
  db.disconnect()
  

if __name__ == "__main__":
  if len(sys.argv) == 2 and sys.argv[1] == 'daemon':
    # run judge as daemon, judge every 5 seconds
    with daemon.DaemonContext(): 
      # may direct stdout/stderr=sys.stdout/sys.stderr
      while True:
        main()
        time.sleep(5)
  else:
    # run judge once
    main()
  