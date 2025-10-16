import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  displayProduct:boolean=false;
  addProduct:boolean=false;
  dashboard:boolean=true;

  constructor(private router:Router, private navbarService: NavbarService){}
  
  ngOnInit(): void {
    this.navbarService.hide();
  }
  ngOnDestroy(): void {
    this.navbarService.show();
  }
  displayProducts(){
    this.addProduct=false;
    this.dashboard=false;
    this.displayProduct=true;
  }

  showDashboard(){
    this.dashboard=true;
    this.displayProduct=false;
    this.addProduct=false;
  }
  addProducts(){
    this.dashboard=false;
    this.displayProduct=false;
    this.addProduct=true;
  }
  logout(){
    this.router.navigateByUrl("/login");
  }
}

