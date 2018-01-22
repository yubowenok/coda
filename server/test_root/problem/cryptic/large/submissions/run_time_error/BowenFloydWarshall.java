import java.io.*;
import java.util.*;

public class BowenFloydWarshall {
  static int gcd(int x, int y) {
    return y == 0 ? x : gcd(y, x % y);
  }
  public static void main(String[] args ) throws IOException{
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    int T = Integer.parseInt(br.readLine());
    while (T-- > 0) {
      String [] tokens = br.readLine().split(" ");
      int N = Integer.parseInt(tokens[0]),
          A = Integer.parseInt(tokens[1]),
          B = Integer.parseInt(tokens[2]);

      if (gcd(A, B) <= 2) {
        System.out.println(A + " " + B);
        continue;
      }
      int [][] dst = new int[N+1][N+1];
      int [][] pre = new int[N+1][N+1];
      for (int i = 2; i <= N; i++) {
        for (int j = 2; j <= N; j++) {
          dst[i][j] = i == j ? 0 : gcd(i, j);
          pre[i][j] = i;
        }
      }
      for (int k = 2; k <= N; k++) {
        for (int i = 2; i <= N; i++) {
          for (int j = 2; j <= N; j++) {
            if (dst[i][k] + dst[k][j] < dst[i][j]) {
              dst[i][j] = dst[i][k] + dst[k][j];
              pre[i][j] = k;
            }
          }
        }
      }
      System.out.println(A + " " + pre[A][B] + " " + B);
    }
  }
}
