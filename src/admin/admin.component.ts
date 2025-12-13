import { Component, OnInit, inject, signal, NgZone } from '@angular/core';
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
  private ngZone = inject(NgZone);
  
  stats = signal<any>({ totalConsultas: 0, pendientes: 0, encontradas: 0, finalizadas: 0 });
  consultations = signal<any[]>([]);
  isLoading = signal<boolean>(true); 
  
  
  selectedConsultation: any = null; 
  currentPage: number = 0;
  totalPages: number = 0;
  isFirst: boolean = true;
  isLast: boolean = false;

  ngOnInit(): void {
    this.loadStats();
    this.loadConsultations(0);
  }

  loadStats(): void {
    this.api.getAdminStats().subscribe({
      next: (data) => {
        
        this.ngZone.run(() => { 
          this.stats.set(data); 
        });
      },
      error: (e) => console.error('Error cargando stats', e)
    });
  }

  loadConsultations(page: number): void {
    this.isLoading.set(true); 
    
    this.api.getAllConsultations(page).subscribe({
      next: (response: any) => {
        this.ngZone.run(() => {
          console.log('Datos recibidos en Admin:', response.content);
          
          
          this.consultations.set(response.content);
          
          
          this.currentPage = response.number;
          this.totalPages = response.totalPages;
          this.isFirst = response.first;
          this.isLast = response.last;
          
          
          this.isLoading.set(false);
        });
      },
      error: (err) => {
        console.error('Error cargando tabla:', err);
        this.ngZone.run(() => { this.isLoading.set(false); });
      }
    });
  }

  
  prevPage(): void {
    if (!this.isFirst) this.loadConsultations(this.currentPage - 1);
  }

  nextPage(): void {
    if (!this.isLast) this.loadConsultations(this.currentPage + 1);
  }

  
  verDetalle(id: number): void {
    this.api.getAdminConsultationDetail(id).subscribe({
      next: (data) => {
        this.ngZone.run(() => { this.selectedConsultation = data; });
      },
      error: (err) => alert('Error cargando detalle: ' + err.message)
    });
  }

  cerrarModal(): void {
    this.selectedConsultation = null;
  }

  
  cambiarEstado(nuevoEstado: string): void {
    if (!this.selectedConsultation) return;
    
    if(confirm(`¿Confirmas cambiar el estado a ${nuevoEstado}?`)) {
      this.api.updateConsultationStatus(this.selectedConsultation.id, nuevoEstado).subscribe({
        next: () => {
          this.ngZone.run(() => {
             this.selectedConsultation.status = nuevoEstado;
             alert('Estado actualizado correctamente.');
             this.cerrarModal();
             
             this.loadConsultations(this.currentPage);
          });
        },
        error: () => alert('Error al actualizar estado.')
      });
    }
  }
}