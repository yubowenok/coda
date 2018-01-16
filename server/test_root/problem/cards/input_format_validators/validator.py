#!/usr/bin/python2

# cards validator

import sys
sys.path.append('../..')
from validator_lib import *

MAX_T = 15
MAX_N, MAX_Q = 100000, 100000

T = get_int(get_line(), 1, MAX_T)

for i in range(T):
  line = get_line()
  get_ints(line, 2) # check there are 2 ints, N and Q
  tokens = line.split(' ')
  N, Q = get_int(tokens[0], 1, MAX_N), get_int(tokens[1], 1, MAX_Q)
  for j in range(Q):
    line = get_line()
    tokens = line.split(' ')
    op = tokens[0]
    if op == 'd' or op == 's':
      if len(tokens) != 3:
        abort('incorrect token number in d/s question')
      x, y = get_int(tokens[1], 1, N), get_int(tokens[2], 1, N)
      if x == y:
        abort('same values for x and y')
    elif op == 'r' or op == 'b':
      if len(tokens) != 2:
        abort('incorrect token number in r/b question')
      x = get_int(tokens[1], 1, N)
    else:
      abort('unknown question type')

get_EOF()

sys.exit(42)
