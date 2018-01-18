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

const ll INF = (ll)1E12;
#define MAXN 200005

int N, M;
int rnk[MAXN], rep[MAXN], cnt[MAXN];
int find(int k){
  if(rep[k]==k) return k;
  return rep[k] = find(rep[k]);
}
void unionset(int a, int b){
  int x = find(a), y = find(b);
  if(x==y) return;
  if(rnk[x]>rnk[y]) swap(x,y);
  if(rnk[x]==rnk[y]) rnk[y]++;
  rep[x] = y;
  cnt[y] += cnt[x];
}
void bad(int qi) {
  printf("Q%d: ?\n", qi + 1);
}
int main() {
  int T;
  cin >> T;
  while (T--) {
    cin >> N >> M;
    int RED = 2*N+1, BLACK = 2*N+2;
    bool solved = 0;
    REP(i,1,2*N+3) {
      rep[i] = i;
      rnk[i] = 0;
      cnt[i] = i <= 2*N;
    }
    REP(qi,0,M) {
      char op[2];
      int x, y;
      scanf("%s", op);
      if (op[0] == 's' || op[0] == 'd') {
        scanf("%d%d", &x, &y);
        if (solved) continue;
        if (op[0] == 's') {
          if (find(x) == find(y+N)) bad(qi);
          else {
            unionset(x, y);
            unionset(x+N, y+N);
          }
        } else { // 'd'
          if (find(x) == find(y)) bad(qi);
          else {
            unionset(x, y+N);
            unionset(x+N, y);
          }
        }
      } else { // 'r' || 'b'
        scanf("%d", &x);
        if (solved) continue;
        if (op[0] == 'r') {
          if (find(x) == find(BLACK)) bad(qi);
          else {
            unionset(x, RED);
            unionset(x+N, BLACK);
          }
        } else { // 'b'
          if (find(x) == find(RED)) bad(qi);
          else {
            unionset(x, BLACK);
            unionset(x+N, RED);
          }
        }
      }
      if (cnt[find(RED)] + cnt[find(BLACK)] == 2*N) {
        printf("Q%d: I know\n", qi + 1);
        REP(i,1,N+1) printf("%c", find(i) == find(RED) ? 'r' : 'b');
        puts("");
        solved = 1;
      }
    }
    if (!solved) puts("I am not sure");
  }
  return 0;
}
