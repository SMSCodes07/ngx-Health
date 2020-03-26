import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  // Funcion para ir al login
  goToLogin() {
    this.router.navigate(['/login']);
  }
  // Funcion para ir al login
  // Funcion para ir al registro
  goToRegister() {
    this.router.navigate(['/register']);
  }
  // Funcion para ir al registro
}
