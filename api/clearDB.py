#!/usr/bin/env python
import subprocess
import os
import sys
import os.path
import ConfigParser
import shutil

print "Deleting migrations"
for root, dirs, files in os.walk('.') :
    if "migrations" in root :
        for f in files :
            if "__init__" not in f :
                path = os.path.abspath(root+"/"+f)
                print "Deleting %s"%(path)
                os.remove(path)

print "Reading Database Config from api/mysql.cfg"
config = ConfigParser.RawConfigParser()
config.read('api/mysql.cfg')
db = config.get('client','database')
user = config.get('client','user')
password = config.get('client','password')

print "Dropping Tables"

listdropscmd  = 'mysqldump -u%s -p%s --add-drop-table --no-data %s' % (user,password, db)
mysqlcmd = 'mysql -u%s -p%s %s' %(user,password,db)

subprocess.call(listdropscmd+' | grep -e "^DROP \| FOREIGN_KEY_CHECKS" | '+mysqlcmd,shell = True)

print "Clearing ../datafiles"
if os.path.exists('../datafiles') :
    shutil.rmtree('../datafiles')
else :
    print "... but it didn't exist"
print "Remaking ../datafiles"
os.mkdir('../datafiles')
