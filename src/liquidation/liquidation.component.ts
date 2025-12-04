import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-liquidacion-final',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.css']
})
export class LiquidacionFinalComponent {
  datosPago = {
    valorBruto: 50000000,
    comision: 5000000,
    valorNeto: 45000000,
    fechaTransferencia: new Date() 
  };

  descargarPDF(): void {
    alert('Descargando resumen...');
  }
}