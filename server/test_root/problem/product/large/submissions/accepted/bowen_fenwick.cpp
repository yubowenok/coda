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

int N, M, s[MAXN];
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
int countZeroes(int x) {
  return __builtin_popcount((-x&x) - 1);
}
int main() {
  int T;
  cin >> T;
  while (T--) {
    cin >> N >> M;
    FILL(s, 0);
    REP(i,1,N+1) {
      int x;
      scanf("%d", &x);
      add(i, countZeroes(x));
    }
    REP(i,0,M) {
      char op[2];
      int a, b;
      scanf("%s%d%d", op, &a, &b);
      if (op[0] == 'q') {
        printf("%d\n", get(b) - get(a - 1));
      } else {
        int v = get(a) - get(a-1), nv = countZeroes(b);
        if (nv != v) add(a, nv - v);
      }
    }
  }
  return 0;
}
