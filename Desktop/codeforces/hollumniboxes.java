import java.util.Scanner;
import java.util.Arrays;
public class hollumniboxes {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();

        while(t-->0){
        int n = sc.nextInt();
        int k = sc.nextInt();
        int [] arr = new int[n];

        for(int i = 0 ; i<n; i++){
            arr[i]=sc.nextInt();
        }

       int  flag = 0 ; 

        if(k==1){
            
for(int i = 0 ; i<n-1 ; i++){

    if(arr[i] >arr[i+1]){
        flag = 1;
        break;
    }

}

        }

        if(flag ==0){
            System.out.println("YES");
        }else{
        System.out.println("NO");    
        }




        }


    }
}
