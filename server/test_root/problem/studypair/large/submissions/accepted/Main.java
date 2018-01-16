import java.io.*;
import java.util.*;
import java.lang.*;

public class Main {

  public static int MAXN = 100005;
  public static int n,x,y;
  public static int[] A = new int[MAXN];
  public static int[] B = new int[MAXN];
  public static int[] s = new int[MAXN];

  public static void add(int k,int v){
    k++;
    for(;k<MAXN;k+=(k&-k)) s[k] += v;
    return;
  }

  public static int get(int k){
    if(k < 0) return 0;
    k++;
    int ans = 0;
    for(;k>0;k-=k&(-k)){
      ans += s[k];
    }
    return ans;
  }

  public static int findkth(int k){
    int e = 0, cnt = 0;
    for(int i = 18;i>=0;i--){
      int b = 1<<i;
      if(((e+b) >= MAXN) || ((cnt+s[e+b])>=k)) continue;
      e += b;
      cnt += s[e];
    }
    return e;
  }
  public static void main(String[] args) {
    InputStream inputStream = System.in;
    OutputStream outputStream = System.out;
    InputReader in = new InputReader(inputStream);
    PrintWriter out = new PrintWriter(outputStream);
    int t = in.nextInt();
    while(t != 0){
      t -= 1;
      n = in.nextInt();
      x = in.nextInt();
      y = in.nextInt();
      for(int i=0;i<n;i++){
        A[i] = in.nextInt();
      }
      for(int i=0;i<n;i++){
        B[i] = in.nextInt();
      }
      Arrays.fill(s,0);
      for(int i=0;i<n;i++) add(i,1);
      Arrays.sort(A,0,n);
      Arrays.sort(B,0,n);
      int ans = 0;
      int lowX = n-1, highX = n-1, highY = n-1;
      while(highY >= 0 && A[n-1] + B[highY] > y) highY--;
      for(int i = n-1;i>=0;i--){
        while (lowX >= 0 && A[i] - B[lowX] <= x) lowX--;
        while (highX >= 0 && B[highX] - A[i] > x) highX--;
        while (highY < n && ((highY>=0 && A[i] + B[highY] <= y) || (highY<0 && A[i] <= y))){
          highY++;
        }
        int l = lowX + 1, r = Math.min(highX, highY - 1);
        if (r < l) continue;
        int cnt = get(r) - get(l - 1);
        if (cnt == 0) continue;
        add(findkth(get(r)), -1);
        ans++;
      }
      System.out.println(ans);
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

