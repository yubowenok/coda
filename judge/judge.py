import sys, time, os, subprocess, threading
import daemon
import MySQLdb.cursors

OUTPUT_LIMIT = 51200*1024
STACK_SIZE = 8192*1024
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



def judge(db, sub, prob):
  sub_id = str(sub['id'])
  cur = db.cursor()
  
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
    cur.execute("UPDATE submissions SET status=" + str(STATUS_CODES[status]) + " WHERE id=" + sub_id)
  
  def complete():
    cur.execute("DELETE FROM judge_queue WHERE id=" + sub_id)
    cur.close()
  
  
  # judging starts here
  sys.stdout.write("Judging <" + prob['name'] + "> for sub #" + sub_id + "...\n")
  
  
  # compile the src, status <- compling
  set_status('compiling')
  cret = compile(sub['language'], sub['src_path'])
  # compilation error, move compiler msg to /coda/ce
  if cret != 0:
    if cret == -1:
      sys.stderr.write("unrecognized sub compiler" + sub['language'])
    else: 
      subprocess.Popen(["mv", "/sandbox/compiler_out", "/data/coda/ce/" + sub_id + ".ce"])
      # status <- complete
      set_status('complete')
      complete()
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
      fd = os.dup(3)
      sys.stdout.write("Running test " + infile_path + "...\n")
     
      # TODO: lrun drops mysql connection
      args = ["lrun"]
      args += ["--isolate-process", "false"]
      args += ["--max-cpu-time", str(prob['time_limit'] / 1000.0)]
      args += ["--max-memory", str(prob['memory_limit'] * 1024)]
      args += ["--max-output", str(OUTPUT_LIMIT)]
      args += ["--max-stack", str(STACK_SIZE)]
      args += ["--status"]
      
      args += ["/sandbox/program"]
      
      infile = open(infile_path, 'r')
      outfile = open(outfile_path, 'w')
      
      # open a new fd for lrun, and dup it to fd 3 to capture lrun message
      lrunfile = os.open(lrunfile_path, os.O_RDWR)
      os.dup2(lrunfile, 3)
      
      p = subprocess.Popen(args,
        stdin=infile,
        stdout=outfile,
        stderr=subprocess.PIPE #sys.stderr
      )
      p.communicate()
      #p.wait()
  
  complete()
  
def main():
  db = MySQLdb.connect(host="localhost", 
                       user="coda", 
                       passwd="coda", 
                       db="codadb",
                       cursorclass=MySQLdb.cursors.DictCursor)
  cur_queue = db.cursor()
  cur_queue.execute("SELECT * FROM judge_queue")
  for row_queue in cur_queue.fetchall():
    cur_sub = db.cursor()
    cur_sub.execute("SELECT * FROM submissions WHERE id=" + str(row_queue['id']))
    if cur_sub.rowcount == 0:
      sys.stderr.write("cannot find sub (judge_queue) from submissions\n")
      return
    sub = cur_sub.fetchone()
    cur_prob = db.cursor()
    cur_prob.execute("SELECT * FROM problems WHERE id=" + str(sub['problem_id']))
    prob = cur_prob.fetchone()
    judge(db, sub, prob)
    break

if __name__ == "__main__":
  main()