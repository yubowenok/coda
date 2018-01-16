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
#define MAXN 1005

int N, M, x[MAXN];
int main() {
  int T;
  cin >> T;
  while (T--) {
    cin >> N >> M;
    REP(i,0,N) cin >> x[i];
    sort(x, x + N);
    while (M--) {
      int q;
      cin >> q;
      int ans = 0;
      REP(i,0,N) {
        int jstart = lower_bound(x + i + 1, x + N, q - x[i]) - x;
        REP(j,jstart,N) {
          // This could become degenerate and take linear time.
          // Then the total time per query is still N^2.
          // However since queries are unique, this cannot be repeated Q times.
          if (x[i] + x[j] > q) break;
          ans++;
        }
      }
      cout << ans << endl;
    }
  }
  return 0;
}
