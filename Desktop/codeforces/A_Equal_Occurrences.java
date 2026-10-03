import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;
public class A_Equal_Occurrences {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();

        while(t-->0){
            int n = sc.nextInt();
            int [] a = new int[n];
            for(int i = 0 ; i < n ; i ++){
               a[i]=sc.nextInt();
             }

        
         int count = 1;
         ArrayList <Integer> list = new ArrayList<>();
         for(int i =1; i<n ; i++){
            if(a[i]!=a[i-1]){
                list.add(count);
                count=1;
            }else{
                count ++;
            }
         }
         list.add(count);

Collections.sort(list);

 int listlen = list.size();
int maxlen = 0 ;

for(int i = 0 ; i < listlen ; i ++){
    int k = list.get(i);
    int freqlen = listlen-i;
    int currlen = k*freqlen;
    maxlen = Math.max(maxlen, currlen);
}
System.out.println(maxlen);

        }


        }

    }


