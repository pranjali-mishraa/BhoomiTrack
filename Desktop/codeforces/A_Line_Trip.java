import java.util.*;

public class A_Line_Trip {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int t = sc.nextInt();
while(t-->0){
    int n =sc.nextInt();
    int x = sc.nextInt();

    int arr[] =  new int[n+2];
    arr[0]=0;
    arr[arr.length-1] = x;
for(int i = 1; i<=arr.length-2;i++){
    arr[i]=sc.nextInt();
}


int difarr [] = new int[arr.length-1];
int res = 0 ;

for(int i =0 ; i<arr.length-1; i++){
    int temp=0;
    if(i==arr.length-2){
         temp = 2*(arr[i+1]-arr[i]);
    }else{
         temp= arr[i+1]-arr[i];
    }
   
    res = Math.max(res, temp);
}

System.out.println(res);
}

    }
}