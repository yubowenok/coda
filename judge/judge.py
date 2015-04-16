import sys, time, os, subprocess
import daemon
import MySQLdb.cursors

# run judge as daemon
#with daemon.DaemonContext(stderr=sys.stderr):
#  while True:
#    time.sleep(1)

def compile(lang, src):
  print lang, src
  if lang == 0:
    with open('/sandbox/compiler_out', 'w', 0) as cout:
      ret = subprocess.call(["g++", "-o", "/sandbox/program", src], stderr=cout)
      if ret != 0:
        sys.stderr.write("compilation error\n")
      else:
        sys.stderr.write("compilation succeeded\n")
      return ret
      

def judge(sub, prob):
  sys.stdout.write("Judging <" + prob['name'] + "> for sub #" + str(sub['id']) + "...\n")
  
  # compile the src
  cret = compile(sub['language'], sub['src_path'])
  # compilation error, move compiler msg to /coda/ce
  if cret != 0: 
    subprocess.Popen(["mv", "/sandbox/compiler_out", "/data/coda/ce/" + str(sub['id']) + ".ce"])
    return 
  
  test_num = prob['test_num']
  for test_id in range(1, test_num+1):
    pass
  
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
    judge(sub, prob)

if __name__ == "__main__":
  main()