import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-liquidation', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.css']
})
export class LiquidationComponent implements OnInit {

  
  
  datosPago: any = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    
    const state = history.state;
    console.log("Estado recibido en Liquidación:", state);

    if (state && state.consultationId) {
      
      this.datosPago = {
        id: state.consultationId,
        email: state.email,
        
        
        valorBruto: 50000000, 
        comision: 5000000,
        valorNeto: 45000000,
        fechaTransferencia: new Date()
      };
    } else {
      
      
      console.warn("No se recibieron datos de navegación. Usando datos por defecto.");
      this.datosPago = {
        valorBruto: 0,
        comision: 0,
        valorNeto: 0,
        fechaTransferencia: new Date(),
        mensaje: "No se encontró información del caso."
      };
    }
  }

  descargarPDF(): void {
    if (this.datosPago && this.datosPago.valorNeto > 0) {
        alert('Descargando resumen del caso #' + (this.datosPago.id || 'N/A'));
    } else {
        alert('No hay datos suficientes para descargar.');
    }
  }
}