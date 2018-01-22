#!/usr/bin/python2

# studypair (large) validator

import sys
sys.path.append('../../..')
from validator_lib import *

MAX_T = 20
MAX_N = 100000
MIN_VAL, MAX_VAL = 0, int(1e9)

T = get_int(get_line(), 1, MAX_T)

for i in range(T):
  line = get_line()
  get_ints(line, 3) # check there are 3 ints
  tokens = line.split(' ')
  N = get_int(tokens[0], 1, MAX_N)
  X, Y = get_int(tokens[1], MIN_VAL, MAX_VAL), get_int(tokens[2], MIN_VAL, MAX_VAL)
  get_ints(get_line(), N, MIN_VAL, MAX_VAL) # numbers for class A
  get_ints(get_line(), N, MIN_VAL, MAX_VAL) # numbers for class B

get_EOF()

sys.exit(42)
