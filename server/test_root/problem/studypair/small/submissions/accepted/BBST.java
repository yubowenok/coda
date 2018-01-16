import java.io.*;
import java.util.*;
import java.lang.*;

public class BBST {
  public static void main(String[] args) {
    InputStream inputStream = System.in;
    InputReader in = new InputReader(inputStream);
    int t = in.nextInt();
    while (t-- > 0) {
      int N = in.nextInt(), X = in.nextInt(), Y = in.nextInt();
      int [] A = new int[N];
      int [] B = new int[N];
      for (int i = 0; i < N; i++) {
        A[i] = in.nextInt();
      }
      Arrays.sort(A);
      TreeMap<Integer, Integer> vals = new TreeMap<Integer, Integer>();
      for (int i = 0; i < N; i++) {
        B[i] = in.nextInt();
        if (vals.containsKey(B[i])) vals.put(B[i], vals.get(B[i]) + 1);
        else vals.put(B[i], 1);
      }
      int ans = 0;
      for (int i = N - 1; i >= 0; i--) {
        int bound = Math.min(A[i] + X, Y - A[i]);
        Integer e = vals.lowerKey(bound + 1);
        if (e == null || e < A[i] - X) continue;
        if (vals.get(e) == 1) vals.remove(e);
        else vals.put(e, vals.get(e) - 1);
        ans++;
      }
      System.out.println(ans);
    }
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

