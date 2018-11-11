import { Component, OnInit } from '@angular/core';
import { CopyService } from '../copy.service';
const { version: codaVersion } = require('../../../package.json');

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(
    private copy: CopyService
  ) { }

  cppTemplate = `#include <iostream>
using namespace std;
int main() {
  int a,b;
  cin >> a >> b;
  cout << a+b << endl;
  return 0;
}`;

  cppFasterIOTemplate = `#include <iostream>
using namespace std;
int main() {
  int a, b;
  scanf("%d%d", &a, &b);
  printf("%d\\n", a + b);
  return 0;
}`;

  javaTemplate = `import java.io.*;
import java.util.*;
public class Main
{
  public static void main (String args[]) throws Exception
  {
    Scanner cin = new Scanner(System.in);
    int a = cin.nextInt(), b = cin.nextInt();
    System.out.println(a + b);
  }
}`;

  javaFasterIOTemplate = `import java.io.*;
import java.util.*;
public class Main
{
  public static void main (String args[]) throws Exception
  {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    StringTokenizer st = new StringTokenizer(in.readLine());
    int a = Integer.parseInt(st.nextToken());
    int b = Integer.parseInt(st.nextToken());
    BufferedWriter out = new BufferedWriter(new OutputStreamWriter(System.out));
    out.write((a + b) + "\n");
    out.flush();
  }
}`;

  codaVersion: string;

  ngOnInit() {
    this.codaVersion = codaVersion;
  }

  copyText(text: string): void {
    this.copy.copyText(text, 'code copied');
  }

}
