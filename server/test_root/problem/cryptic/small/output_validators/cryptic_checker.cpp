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
#include <fstream>
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

#ifdef UCPCCC
#define ACCEPT 0
#else
#define ACCEPT 42
#endif
#define REJECT 43

// input data, judge answer, user output
ifstream answer;
istream *userout;

bool notDigit(string &s) {
  REP(i,0,s.size()) if (!(s[i] >= '0' && s[i] <= '9')) return 1;
  return false;
}
int gcd(int x, int y) {
  return !y ? x : gcd(y, x%y);
}
int reject(string err) {
  cerr << err << endl;
  return REJECT;
}

int main(int argc, char **argv) {
  if (argc < 3) {
    cerr << "expecting two file arguments" << endl;
    return REJECT;
  }
#ifdef UCPCCC
  // On ucpccc, args are {user_output} {judge_answer}
  // Config datafiles.txt to use the input data as answer files
  answer.open(argv[2], ifstream::in);
  ifstream userStream(argv[1], ifstream::in);
  userout = &userStream;
#else
  // For this problem, judge answer is just the input file.
  // On kattis, args are {input_data} {judge_answer}, user output is from stdin
  answer.open(argv[1], ifstream::in); // use input data as answer file
  userout = &cin;
#endif
  int T;
  answer >> T;
  while (T--) {
    int N, A, B, x;
    string s;
    answer >> N >> A >> B;
    string line;
    getline(*userout, line);
    stringstream sin(line);
    vector<string> tokens;
    while (sin >> s) tokens.push_back(s);
    VI path;
    REP(i,0,tokens.size()) {
      if (notDigit(tokens[i])) return reject("non-digit characters found");
      else {
        sscanf(tokens[i].c_str(), "%d", &x);
        path.push_back(x);
      }
    }
    if (path.size() < 1 || path.size() > 3) return reject("path length is not 2 or 3");
    int expectedSP = gcd(A, B) == 1 ? 1 : 2;
    int userSP = 0, len = path.size();
    if (path[0] != A || path[len - 1] != B) return reject("does not start with A or end with B");
    REP(i,0,len) {
      if (!(path[i] >= 2 && path[i] <= N)) return reject("node is out of [2, N]");
      REP(j,i+1,len) if (path[i] == path[j]) return reject("nodes are repeated");
    }
    REP(i,1,len) userSP += gcd(path[i], path[i-1]);
    if (userSP != expectedSP) return reject("not a shortest path");
  }
  answer.close();
  ((ifstream *)userout)->close();
  return ACCEPT;
}
