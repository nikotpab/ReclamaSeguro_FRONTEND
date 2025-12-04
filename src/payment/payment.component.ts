import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-paso-cuatro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class Payment {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private datosService = inject(DatosCompartidosService);
  
  selectedMethod: string = 'credit-card';
  isProcessing: boolean = false;

  selectMethod(method: string): void {
    this.selectedMethod = method;
  }

  processPayment(): void {
    this.isProcessing = true;
    
    // Recuperar ID de la consulta guardada en pasos anteriores
    const datos = this.datosService.obtenerDatos();
    const consultationId = datos.consultationId;

    if (!consultationId) {
      alert('Error: No se encontró el número de trámite. Vuelva a iniciar.');
      this.isProcessing = false;
      return;
    }

    // Llamar al Backend
    this.apiService.processPayment(consultationId).subscribe({
      next: (res) => {
        console.log('Backend:', res);
        // Simular un pequeño delay para UX
        setTimeout(() => {
          this.isProcessing = false;
          this.router.navigate(['estado-solicitud']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error en pago:', err);
        alert('Hubo un error procesando el pago.');
        this.isProcessing = false;
      }
    });
  }
}