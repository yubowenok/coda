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
#define MAXN 100005
int N, M, x[MAXN];
int main() {
  int T;
  cin >> T;
  while (T--) {
    cin >> N >> M;
    REP(i,1,N+1) {
      int v;
      scanf("%d", &v);
      x[i] = __builtin_popcount((-v&v)-1);
    }
    REP(i,1,N+1) x[i] += x[i-1];
    REP(i,0,M) {
      char op[2];
      int a, b;
      scanf("%s%d%d", op, &a, &b);
      if (op[0] == 'q') printf("%d\n", x[b] - x[a - 1]);
    }
  }
  return 0;
}
