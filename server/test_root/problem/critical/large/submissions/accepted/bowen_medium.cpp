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
#define MAXN 2005


int L, lis[MAXN];
int LIS(VI &v) {
  L = 0;
  int n = v.size();
  REP(i,0,n) {
    int p = lower_bound(lis, lis + L, v[i]) - lis;
    lis[p] = v[i];
    if (p == L) L++;
  }
  return L;
}

int main() {
  int T;
  cin >> T;
  while (T--) {
    int N;
    cin >> N;
    VI vals;
    REP(i,0,N) {
      int v;
      scanf("%d", &v);
      vals.push_back(v);
    }
    int orig = LIS(vals);
    VI ans;
    REP(i,0,N) {
      VI vs = vals;
      vs.erase(vs.begin() + i);
      if (LIS(vs) != orig) ans.push_back(vals[i]);
    }
    if (ans.empty()) puts("-1");
    else {
      REP(i,0,ans.size()-1) printf("%d ", ans[i]);
      printf("%d\n", ans[ans.size() - 1]);
    }
  }
  return 0;
}
