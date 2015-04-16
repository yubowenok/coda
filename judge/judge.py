import sys, time
import daemon
import MySQLdb

# run judge as daemon
#with daemon.DaemonContext(stderr=sys.stderr):
#  while True:
#    time.sleep(1)


db = MySQLdb.connect(host="localhost", user="coda", passwd="coda", db="codadb")
cur = db.cursor()
cur.execute("SELECT * FROM judge_queue")

for row in cur.fetchall() :
    print row[0]