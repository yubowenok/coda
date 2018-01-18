import java.io.*;
import java.util.*;
import java.lang.*;

public class Main {
  public static int MAXN = 200005;
  public static int N,M;
  public static int[] rnk = new int[MAXN];
  public static int[] rep = new int[MAXN];
  public static int[] cnt = new int[MAXN];
  public static long  inf = 1000000000000L;

  public static int find(int k){
    if (rep[k] == k) return k;
    return rep[k] = find(rep[k]);
  }

  public static void unionset(int a,int b){
    int x = find(a), y = find(b);
    if (x == y) return;
    if (rnk[x] > rnk[y]){
      int temp = x;
      x = y;
      y = temp;
    }
    if (rnk[x] == rnk[y]) rnk[y]++;
    rep[x] = y;
    cnt[y] += cnt[x];
  }

  public static void bad(int qi){
    System.out.format("Q%d: ?\n",qi+1);
  }

  public static void main(String[] args) {
    InputStream inputStream = System.in;
    OutputStream outputStream = System.out;
    InputReader in = new InputReader(inputStream);
    PrintWriter out = new PrintWriter(outputStream);
    int t = in.nextInt();
    while (t-- > 0){
      N = in.nextInt();
      M = in.nextInt();
      int RED = 2*N+1, BLACK = 2*N+2;
      Boolean solved = false;
      for(int i=1;i<2*N+3;i++) {
        rep[i] = i;
        rnk[i] = 0;
        if(i <= 2*N) cnt[i] = 1;
        else cnt[i] = 0;
      }
      for(int qi=0;qi<M;qi++) {
        char op;
        int x, y;
        op = in.next().charAt(0);
        if (op == 's' || op == 'd') {
          x = in.nextInt();
          y = in.nextInt();
          if (solved) continue;
          if (op == 's') {
            if (find(x) == find(y+N)) bad(qi);
            else {
              unionset(x, y);
              unionset(x+N, y+N);
            }
          }
          else { // 'd'
            if (find(x) == find(y)) bad(qi);
            else {
              unionset(x, y+N);
              unionset(x+N, y);
            }
          }
        } else { // 'r' || 'b'
          x = in.nextInt();
          if (solved) continue;
          if (op == 'r') {
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
          System.out.format("Q%d: I know\n", qi + 1);
          for(int i=1;i<N+1;i++) System.out.format("%c", find(i) == find(RED) ? 'r' : 'b');
          solved = true;
          System.out.println();
        }
      }
      if (!solved) System.out.println("I am not sure");
    }
    out.close();
  }

  static class InputReader {
    public BufferedReader reader;
    public StringTokenizer tokenizer;

    public InputReader(InputStream stream) {
      reader = new BufferedReader(new InputStreamReader(stream), 32768);
      tokenizer = null;
    }

    public String next() {
      while (tokenizer == null || !tokenizer.hasMoreTokens()) {
        try {
          tokenizer = new StringTokenizer(reader.readLine());
        } catch (IOException e) {
          throw new RuntimeException(e);
        }
      }
      return tokenizer.nextToken();
    }

    public int nextInt() {
      return Integer.parseInt(next());
    }
  }
}

