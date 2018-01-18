#!/usr/bin/python2

# critical (large) validator

import sys
sys.path.append('../../..')
from validator_lib import *

MAX_T = 30
MAX_N = 2000

T = get_int(get_line(), 1, MAX_T)

for _ in range(T):
  N = get_int(get_line(), 1, MAX_N)
  ints = get_ints(get_line(), N, 1, N)
  ints = sorted(ints)
  for i in range(N):
    if ints[i] != i + 1:
      abort('not a permutation of [1, N]')

get_EOF()

sys.exit(42)
