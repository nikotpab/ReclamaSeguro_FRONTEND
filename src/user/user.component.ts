import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class PanelUsuarioComponent implements OnInit {
  consultas: any[] = [];
  loading = true;
  
  private api = inject(ApiService);
  private datos = inject(DatosCompartidosService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const userData = this.datos.obtenerDatos();
    
    if (!userData.userId) {
      this.router.navigate(['/auth']);
      return;
    }

    this.api.getConsultationsByUser(userData.userId).subscribe({
      next: (data) => {
        this.consultas = data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  verDetalle(consulta: any): void {
    this.datos.guardarDatos({ consultationId: consulta.id });

    switch (consulta.status) {
      case 'IN_PROGRESS':
      case 'PAID':
        this.router.navigate(['/solicitudes']); 
        break;

      case 'NOT_FOUND':
        this.router.navigate(['/resultado'], { queryParams: { estado: 'NOT_FOUND' } }); 
        break;

      case 'FOUND':
        this.router.navigate(['/resultado'], { queryParams: { estado: 'FOUND' } }); 
        break;

      case 'CLAIM_STARTED': 
        this.router.navigate(['/seguimiento']); 
        break;

      case 'LIQUIDATION_READY':
        this.router.navigate(['/liquidacion']); 
        break;

      default:
        this.router.navigate(['/estado-solicitud']);
    }
  }
}