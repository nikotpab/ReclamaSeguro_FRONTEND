import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-cuatro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class Payment {
  private router = inject(Router);
  
  selectedMethod: string = 'credit-card';
  isProcessing: boolean = false;

  selectMethod(method: string): void {
    this.selectedMethod = method;
  }

  processPayment(): void {
    this.isProcessing = true;

    setTimeout(() => {
      this.isProcessing = false;
      console.log('Pago aprobado. Disparando backend...');
      this.router.navigate(['solicitudes']);
    }, 2500);
  }
}