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

int dst[MAXN], pre[MAXN];
int gcd(int x, int y) {
  return !y ? x : gcd(y, x % y);
}
struct dij {
  int x, d;
  dij(int _x, int _d): x(_x), d(_d) {}
  bool operator < (const dij &ano) const {
    return d > ano.d;
  }
};
int main() {
  int T;
  cin >> T;
  while (T--) {
    int N, A, B;
    cin >> N >> A >> B;
    REP(i,2,N+1) {
      dst[i] = INF;
      pre[i] = -1;
    }
    dst[A] = 0;
    priority_queue<dij> pq;
    pq.push(dij(A, 0));
    while (!pq.empty()) {
      dij now = pq.top(); pq.pop();
      int x = now.x, d = now.d;
      if (d > dst[x]) continue;
      if (x == B) {
        VI path;
        while (1) {
          path.push_back(x);
          if (x == A) break;
          x = pre[x];
        }
        reverse(path.begin(), path.end());
        REP(i,0,path.size()) printf("%d ", path[i]);
        puts("");
        break;
      }
      REP(y, 2, N+1) {
        int nd = d + gcd(x, y);
        if (nd < dst[y]) {
          dst[y] = nd;
          pre[y] = x;
          pq.push(dij(y, nd));
        }
      }
    }
  }
  return 0;
}
