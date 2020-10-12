import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  navLinks: any[] = [
    {
      label: 'Overview',
      link: '/',
      prefix: "01",
      index: 0
    },
    {
      label: 'Covid-19 and Mobility',
      link: '/heat-map',
      prefix: "02",
      index: 1
    },
    {
      label: 'Economic Sectors',
      link: '/economic-mobility',
      prefix: "03",
      index: 2
    },
    {
      label: 'Predicted Mobility',
      link: '/prediction',
      prefix: "04",
      index: 3
    },
    {
      label: 'Project Details',
      link: '/project-details',
      prefix: "05",
      index: 4
    },
  ];

  activeLink = this.navLinks[0];
  nextLink;
  previousLink;
  numOfLinks = this.navLinks.length;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLink = this.navLinks.find(tab => tab.link === this.router.url);
      if (this.activeLink.index > 0) {
        this.previousLink = this.navLinks[this.activeLink.index-1] 
      } else {
        this.previousLink = undefined;
      }
      if ( this.activeLink.index < this.numOfLinks-1 ) {
        this.nextLink = this.navLinks[this.activeLink.index+1]
      } else {
        this.nextLink = undefined
      }
    });
  }

}
  