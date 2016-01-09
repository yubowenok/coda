#!/usr/bin/env python
import subprocess
import os
import sys
import os.path

print "Deleting migrations"
for root, dirs, files in os.walk('.') :
    if "migrations" in root :
        for f in files :
            if "__init__" not in f :
                path = os.path.abspath(root+"/"+f)
                print "Deleting %s"%(path)
                os.remove(path)

print "Dropping Tables"
subprocess.call('mysqldump -ucoda -pcoda --add-drop-table --no-data Coda | grep -e "^DROP \| FOREIGN_KEY_CHECKS" | mysql -ucoda -pcoda Coda',shell = True)
print "Clearing ../filedata"
subprocess.call('rm -rf ../filedata', shell=True)
subprocess.call('mkdir ../filedata', shell=True)
