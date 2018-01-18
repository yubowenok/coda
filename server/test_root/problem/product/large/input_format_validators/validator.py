#!/usr/bin/python2

# product (large) validator

import sys
sys.path.append('../../..')
from validator_lib import *

MAX_T = 15
MAX_N, MAX_Q = 100000, 100000
MIN_VAL, MAX_VAL = 1, int(1e9)

T = get_int(get_line(), 1, MAX_T)

for i in range(T):
  line = get_line()
  get_ints(line, 2) # check there are 2 ints, N and Q
  tokens = line.split(' ')
  N, Q = get_int(tokens[0], 1, MAX_N), get_int(tokens[1], 1, MAX_Q)
  get_ints(get_line(), N, MIN_VAL, MAX_VAL) # numbers in the array
  for j in range(Q):
    line = get_line()
    tokens = line.split(' ')
    if len(tokens) != 3:
      abort('incorrect number of tokens')
    op = tokens[0]
    if op == 'q':
      l, r = get_int(tokens[1], 1, N), get_int(tokens[2], 1, N)
      if not l <= r:
        abort('l > r')
    elif op == 's':
      i, v = get_int(tokens[1], 1, N), get_int(tokens[2], MIN_VAL, MAX_VAL)
    else:
      abort('unknown query type')

get_EOF()

sys.exit(42)
