#!/usr/bin/env python
import subprocess
subprocess.call('python clearDB.py',shell=True)
subprocess.call('python manage.py makemigrations',shell=True)
subprocess.call('python manage.py migrate',shell=True)
subprocess.call('python generateData.py',shell=True)

