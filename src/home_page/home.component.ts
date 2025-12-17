import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) { }


  irALogin(): void {
    this.router.navigate(['/autenticacion'], { queryParams: { mode: 'login' } });
  }

  irARegistro(): void {
    this.router.navigate(['/autenticacion'], { queryParams: { mode: 'register' } });
  }
}