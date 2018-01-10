import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor() { }

  private cppTemplate = _.escape(`#include <iostream>
using namespace std;
int main() {
    int a,b;
    cin >> a >> b;
    cout << a+b << endl;
    return 0;
}`);

  private cppFasterIOTemplate = _.escape(`#include <iostream>
using namespace std;
int main() {
    int a, b;
    scanf("%d%d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}`);

  private javaTemplate = _.escape(`import java.io.*;
import java.util.*;
public class Main
{
  public static void main (String args[]) throws Exception
  {
    Scanner cin = new Scanner(System.in);
    int a = cin.nextInt(), b = cin.nextInt();
    System.out.println(a + b);
  }
}`);

  private javaFasterIOTemplate = _.escape(`import java.io.*;
import java.util.*;
public class Main
{
  public static void main (String args[]) throws Exception
  {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String line = br.readLine();
    StringTokenizer st = new StringTokenizer(line);
    int a = Integer.parseInt(st.nextToken());
    int b = Integer.parseInt(st.nextToken());
    StringBuilder sb = new StringBuilder();
    sb.append(String.format("%d\\n", a + b));
    System.out.print(sb.toString());
  }
}`);

  ngOnInit() {
  }

}
