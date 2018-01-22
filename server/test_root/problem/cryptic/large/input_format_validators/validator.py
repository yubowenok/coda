#!/usr/bin/python2

# cryptic (large) validator

import sys
sys.path.append('../../..')
from validator_lib import *

MAX_T = 30
MAX_N = int(1e6)

T = get_int(get_line(), 1, MAX_T)

for _ in range(T):
  line = get_line()
  get_ints(line, 3) # check there are 3 ints: N, A, B
  tokens = line.split(' ')
  N = get_int(tokens[0], 1, MAX_N)
  A, B = get_int(tokens[1], 2, N), get_int(tokens[2], 2, N)
  if A == B:
    abort('A, B should not be equal')

get_EOF()

sys.exit(42)
