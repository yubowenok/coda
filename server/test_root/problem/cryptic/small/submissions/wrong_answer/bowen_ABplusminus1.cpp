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
#define MAXN 1000001

int gcd(int x, int y) {
  return !y ? x : gcd(y, x % y);
}
int main() {
  int T;
  cin >> T;
  while (T--) {
    int N, A, B;
    cin >> N >> A >> B;
    if (gcd(A, B) <= 2) {
      printf("%d %d\n", A, B);
      continue;
    }
    int sm = min(A, B), lg = max(A, B);
    if (gcd(sm+1, lg) == 1) printf("%d %d %d\n", A, sm+1, B);
    else if (sm-1 >= 2 && gcd(sm-1, lg) == 1) printf("%d %d %d\n", A, sm-1, B);
    else if (lg+1 <= N && gcd(sm, lg+1) == 1) printf("%d %d %d\n", A, lg+1, B);
    else printf("%d %d %d\n", A, lg-1, B);
  }
  return 0;
}
