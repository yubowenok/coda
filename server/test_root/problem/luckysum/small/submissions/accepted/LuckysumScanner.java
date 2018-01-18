import java.io.*;
import java.util.*;
import java.lang.*;

public class LuckysumScanner {

    public static int MAXN = 1005;
    public static int n,m;
    public static int[] x = new int[MAXN];
    public static int inf = 1000000000;
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();
        while(t != 0){
            t -= 1;
            n = scanner.nextInt();
            m = scanner.nextInt();
            for(int i=0;i<n;i++) x[i] = scanner.nextInt();
            Arrays.sort(x,0,n);
            for(int i=0;i<m;i++){
                int q;
                q = scanner.nextInt();
                int tail = n-1, ans = 0;
                for(int j=0;j<tail;j++){
                    int k = j;
                    while(k < n && x[k] == x[j]) k++;
                    int cntj = k - j;
                    while(tail >= k && x[j] + x[tail] >= q){
                        if(x[j] + x[tail] == q) ans += cntj;
                        tail--;
                    }
                    if(2*x[j] == q){
                        ans += cntj * (cntj - 1) / 2;
                    }
                    j = k-1;
                }
                System.out.println(ans);
            }
        }
    }
}

