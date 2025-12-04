import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service'; 
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-upload-documents', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent { 
  private router = inject(Router);
  private apiService = inject(ApiService);
  private datosService = inject(DatosCompartidosService);
  

  docs = [
    { id: 1, type: 'cedula', label: 'Cédula del consultante', uploaded: false },
    { id: 2, type: 'defuncion', label: 'Registro civil de defunción', uploaded: false },
    { id: 3, type: 'parentesco', label: 'Documento que acredite parentesco', uploaded: false }
  ];

  onFileSelected(event: any, docType: string): void {
    const file = event.target.files[0];
    if (!file) return;

    const datos = this.datosService.obtenerDatos();
    

    if (!datos.consultationId) {
      alert('Error: No hay trámite seleccionado.');
      return;
    }

    this.apiService.uploadDocument(datos.consultationId, docType, file).subscribe({
      next: () => {
        const doc = this.docs.find(d => d.type === docType);
        if (doc) doc.uploaded = true;
      },
      error: (err) => alert('Error subiendo archivo')
    });
  }

  get allUploaded(): boolean {
    return this.docs.every(d => d.uploaded);
  }

  continuar(): void {
    if (this.allUploaded) {
      this.router.navigate(['/contrato']); 
    }
  }
}