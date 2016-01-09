import sys
from django.contrib.auth.models import User
from codaauth.models import CodaUser
user = User.objects.create_superuser('brett','','brett')
codauser = CodaUser(user = user)
codauser.save()
