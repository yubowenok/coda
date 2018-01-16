#!/usr/bin/python2

# luckysum (large) validator

import sys
sys.path.append('../../..')
from validator_lib import *

MAX_T = 15
MAX_N, MAX_Q = 1000, 5000
MIN_VAL, MAX_VAL = 0, int(1e6)

T = get_int(get_line(), 1, MAX_T)

for i in range(T):
  line = get_line()
  get_ints(line, 2) # check there are 2 ints, N and Q
  tokens = line.split(' ')
  N, Q = get_int(tokens[0], 1, MAX_N), get_int(tokens[1], 1, MAX_Q)
  get_ints(get_line(), N, MIN_VAL, MAX_VAL) # numbers on the lottery ticket
  sums = {}
  for j in range(Q):
    s = get_ints(get_line(), 1, MIN_VAL, MAX_VAL)[0] # a single query lucky sum
    if s in sums:
      abort('duplicate query sums')
    sums[s] = True 

get_EOF()

sys.exit(42)
