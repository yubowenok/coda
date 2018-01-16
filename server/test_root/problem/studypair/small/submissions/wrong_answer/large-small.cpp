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
#define MAXN 55

int N, X, Y, a[MAXN], b[MAXN];
bool v[MAXN];
int solve(int *a, int *b) {
  FILL(v ,0);
  int ans = 0;
  for (int i = N-1; i>=0; i--) {
    REP(j,0,N) {
      if (a[i] + b[j] > Y || abs(a[i] - b[j]) > X || v[j]) continue;
      v[j] = 1;
      ans++;
      break;
    }
  }
  return ans;
}
int main() {
  int T;
  cin >> T;
  while (T--) {
    cin >> N >> X >> Y;
    REP(i,0,N) scanf("%d", a+i);
    REP(i,0,N) scanf("%d", b+i);
    sort(a, a + N);
    sort(b, b + N);
    cout << max(solve(a,b), solve(b,a)) << endl;
  }
  return 0;
}
