import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ApiService } from '../app/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  
  
  stats: any = { 
    totalConsultas: 0, 
    pendientes: 0, 
    encontradas: 0, 
    finalizadas: 0 
  };

  
  consultations: any[] = [];
  
  
  selectedConsultation: any = null; 
  
  
  isLoading: boolean = true;

  
  currentPage: number = 0;
  totalPages: number = 0;
  isFirst: boolean = true;
  isLast: boolean = false;
  pageSize: number = 10; 

  ngOnInit(): void {
    this.loadStats();
    this.loadConsultations(0); 
  }

  

  loadStats(): void {
    this.api.getAdminStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error cargando estadísticas', err)
    });
  }

  loadConsultations(page: number): void {
    this.isLoading = true;
    
    
    this.api.getAllConsultations(page).subscribe({
      next: (response: any) => {
        
        this.consultations = response.content; 
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.isFirst = response.first;
        this.isLast = response.last;
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando la tabla', err);
        this.isLoading = false;
      }
    });
  }

  

  prevPage(): void {
    if (!this.isFirst) {
      this.loadConsultations(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (!this.isLast) {
      this.loadConsultations(this.currentPage + 1);
    }
  }

  

  verDetalle(id: number): void {
    
    this.api.getAdminConsultationDetail(id).subscribe({
      next: (data) => {
        this.selectedConsultation = data;
      },
      error: (err) => alert('Error cargando el detalle del trámite.')
    });
  }

  cerrarModal(): void {
    this.selectedConsultation = null;
  }

  

  cambiarEstado(nuevoEstado: string): void {
    if (!this.selectedConsultation) return;
    
    const confirmacion = confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}? El usuario verá este cambio inmediatamente.`);
    
    if(confirmacion) {
      this.api.updateConsultationStatus(this.selectedConsultation.id, nuevoEstado).subscribe({
        next: () => {
          
          this.selectedConsultation.status = nuevoEstado;
          
          
          this.loadConsultations(this.currentPage);
          
          alert('Estado actualizado correctamente.');
          this.cerrarModal();
        },
        error: (err) => alert('Error al actualizar el estado.')
      });
    }
  }
}