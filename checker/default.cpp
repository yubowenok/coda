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
#include <fstream>
#include <functional>

using namespace std;

typedef long long ll;
typedef vector<int> VI;
typedef pair<int, int> PII;

#define REP(i,s,t) for(int i=(s);i<(t);i++)
#define FILL(x,v) memset(x,v,sizeof(x))

const int INF = (int)1E9;

int main(int argc, char *argv[]){
	if (argc != 4) {
		cerr << "checker file error" << endl;
		return 0;
	}
	char *ansfile = argv[1], *outfile = argv[2], *resfile = argv[3];
	fstream ans(ansfile, ios::in), out(outfile, ios::in), res(resfile, ios::out);
	if (!ans.is_open() || !out.is_open() || !res.is_open()) {
		cerr << "checker file error" << endl;
		return 0;
	}

	string ansToken, outToken;
	int tokenCnt = 0;
	while (ans >> ansToken) {
		tokenCnt++;
		if (!(out >> outToken)) {
			res << "WA" << endl;
			res << "token #" << tokenCnt++ << " mismatched - ";
			res << "expected: '" << ansToken << "', found: ''" << endl;
			return 0;
		}
		else {
			if (ansToken != outToken) {
				res << "WA" << endl;
				res << "token #" << tokenCnt++ << " mismatched - ";
				res << "expected: '" << ansToken << "', found: ''" << endl;
				return 0;
			}
		}
	}
	res << "AC" << endl;
	res << tokenCnt << " tokens matched" << endl;
	return 0;
}

