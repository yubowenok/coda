#include <iostream>
#include <cstdio>
#include <cmath>
#include <cstring>
#include <algorithm>
#include <string>
#include <vector>
#include <stack>
#include <queue>
#include <set>
#include <map>
#include <sstream>
#include <complex>
#include <ctime>
#include <cassert>
#include <functional>

using namespace std;

typedef long long ll;
typedef vector<int> VI;
typedef pair<int,int> PII;

#define REP(i,s,t) for(int i=(s);i<(t);i++)
#define FILL(x,v) memset(x,v,sizeof(x))

const int INF = (int)1E9;
#define MAXV 1000000

int gcd(int x, int y) {
  return !y ? x : gcd(y, x % y);
}

// 37 is the largest prime needed
int prm[] = {2,3,5,7,11,13,17,19,23,29,31,37};

int main() {
  int P = sizeof(prm) / sizeof(prm[0]);

  // For problem setting only:
  // Distribute the smallest K primes to see if it is possible that we have
  // no prime available between [2, N]?
  REP(K,1,P) {
    REP(m,0,1<<K) {
      ll a = 1, b = 1;
      // Try split the smallest K primes into two multiples.
      REP(i,0,K) if (m & (1<<i)) a *= prm[i];
      else b *= prm[i];
      // Make sure that gcd(a, b) > 1, otherwise answer is directly 1.
      REP(i,0,K) {
        // Give a the smallest prime b has.
        // Also make sure that a != b
        if (b % prm[i] == 0 && a * prm[i] != b) {
          a *= prm[i];
          if (max(a, b) <= prm[K]) {
            cerr << "We don't have any usable primes!" << endl;
            break;
          }
          // We may construct tricky case using this pair of (a, b)
          // as all the smallest K primes are in either a or b.
        }
      }
    }
  }
  // Alternative proof: 2 * 3 * 5 * ... * 37 = 7e12 > (1e6)^2
  // Thus it is not possible that all primes <= 37 are either in A or B.


  // Main solution below
  int T;
  cin >> T;
  while (T--) {
    int N, S, T;
    cin >> N >> S >> T;
    if (gcd(S, T) == 1) {
      printf("%d %d\n", S, T);
    } else {
      REP(i,0,P) {
        int p = prm[i];
        if (gcd(S, p) == 1 && gcd(T, p) == 1) {
          printf("%d %d %d\n", S, p, T);
          break;
        }
      }
    }
  }
  return 0;
}
