import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isCollapsed = false;
  currentUserDetails: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let current_user_details: any = localStorage.getItem('current_user_details');
    this.currentUserDetails = JSON.parse(current_user_details);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
