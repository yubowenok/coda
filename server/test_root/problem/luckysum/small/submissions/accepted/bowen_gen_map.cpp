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
    map<int,int> pairs;
    REP(i,0,N) cin >> x[i];
    REP(i,0,N) REP(j,i+1,N) pairs[x[i]+x[j]]++;
    REP(i,0,M) {
      int q;
      cin >> q;
      cout << pairs[q] << endl;
    }
  }
  return 0;
}
