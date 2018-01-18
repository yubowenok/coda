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


int N, a[MAXN], pos[MAXN], L, lis[MAXN];
VI lisvals[MAXN];
int s[MAXN];
void add(int k, int v){
  k++;
  for(;k<MAXN;k+=-k&k) s[k]+=v;
}
int get(int k){
  if (k < 0) return 0;
  k++;
  int ans = 0;
  for(;k;k-=-k&k) ans += s[k];
  return ans;
}
int main() {
  int T;
  cin >> T;
  while (T--) {
    cin >> N;
    FILL(lis, 0); L = 0;
    REP(len,1,N+1) lisvals[len].clear();
    REP(i,0,N) {
      scanf("%d", a+i);
      pos[a[i]] = i;
      int p = lower_bound(lis, lis + L, a[i]) - lis;
      lis[p] = a[i];
      if (p == L) L++;
      lisvals[p + 1].push_back(a[i]);
    }
    REP(len,1,N+1) sort(lisvals[len].begin(), lisvals[len].end(), greater<int>() );
    VI ans;
    if (lisvals[L].size() == 1) ans.push_back(lisvals[L][0]);
    for (int len = L-1; len >= 1; len--) {
      int i = 0, j = 0, n = lisvals[len+1].size(), m = lisvals[len].size();
      VI important;
      while (j < m) {
        if (i != n && lisvals[len+1][i] > lisvals[len][j]) {
          int val = lisvals[len+1][i];
          add(pos[val], 1);
          i++;
        } else {
          int val = lisvals[len][j];
          int covered = get(N-1) - get(pos[val]);
          if (covered > 0) important.push_back(val);
          j++;
        }
      }
      REP(i,0,lisvals[len+1].size()) add(pos[lisvals[len+1][i]], -1);
      if (important.size() == 1) ans.push_back(important[0]);
      lisvals[len] = important;
    }
    reverse(ans.begin(), ans.end());
    if (ans.empty()) puts("-1");
    else {
      REP(i,0,ans.size()-1) printf("%d ", ans[i]);
      printf("%d\n", ans[ans.size() - 1]);
    }
  }
  return 0;
}
