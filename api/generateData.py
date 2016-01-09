import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")
django.setup()

import codaauth.generateData
import codaproblem.generateData
