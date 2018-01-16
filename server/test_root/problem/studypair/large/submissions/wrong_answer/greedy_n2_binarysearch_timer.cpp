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

int N, X, Y, a[MAXN], b[MAXN];
bool v[MAXN];
double TIME_LIMIT = 2.9;
int main() {
  int T;
  cin >> T;
  double perCaseTL = TIME_LIMIT / T;
  while (T--) {
    clock_t start_time = clock();
    cin >> N >> X >> Y;
    REP(i,0,N) scanf("%d", a+i);
    REP(i,0,N) scanf("%d", b+i);
    sort(a, a + N);
    sort(b, b + N);
    FILL(v ,0);
    int ans = 0;
    for (int i = N-1; i>=0; i--) {
      int highj = upper_bound(b, b + N, min(a[i] + X, Y - a[i])) - b - 1;
      double cpu_time = double(clock() - start_time)/CLOCKS_PER_SEC;
      if (cpu_time > perCaseTL) break;
      for (int j = highj; j>=0; j--) {
        if (v[j]) continue;
        if (a[i] - b[j] > X) break;
        v[j] = 1;
        ans++;
        break;
      }
    }
    cout << ans << endl;
  }
  return 0;
}
