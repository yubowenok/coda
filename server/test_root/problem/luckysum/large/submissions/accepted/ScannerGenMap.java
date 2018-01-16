import java.io.*;
import java.util.*;
import java.lang.*;

public class ScannerGenMap {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int t = scanner.nextInt();
    while (t-- > 0) {
      int N = scanner.nextInt(), Q = scanner.nextInt();
      int []x = new int[N];
      for (int i = 0; i < N; i++) x[i] = scanner.nextInt();
      TreeMap<Integer, Integer> cnt = new TreeMap<Integer,Integer>();
      for (int i = 0; i < N; i++) {
        for (int j = i+1; j < N; j++) {
          int s = x[i] + x[j];
          if (cnt.containsKey(s)) cnt.put(s, cnt.get(s) + 1);
          else cnt.put(s, 1);
        }
      }
      for (int i = 0; i < Q; i++) {
        int q = scanner.nextInt();
        Integer e = cnt.get(q);
        System.out.println(e == null ? 0 : e);
      }
    }
  }
}

