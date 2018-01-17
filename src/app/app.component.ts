import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouterEvent, ActivatedRoute } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'coda';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  private lastPoppedUrl: string | undefined;
  private yScrollStack: number[] = [];

  ngOnInit() {
    // Handle scrolling with hashtag fragments.
    this.location.subscribe((event: PopStateEvent) => {
      this.lastPoppedUrl = event.url;
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          // you can use DomAdapter
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            setTimeout(() => element.scrollIntoView(), 0); // queue the scroll
            return;
          }
        }
        const newScrollY = event.url === this.lastPoppedUrl ? this.yScrollStack.pop() : 0;
        setTimeout(() => window.scrollTo(0, newScrollY), 0);
      }
    });
  }

}
