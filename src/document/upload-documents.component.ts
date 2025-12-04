import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carga-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class CargaDocumentosComponent {
  private router = inject(Router);
  
  docs = [
    { id: 1, label: 'Cédula del consultante', uploaded: false },
    { id: 2, label: 'Registro civil de defunción', uploaded: false },
    { id: 3, label: 'Documento que acredite parentesco', uploaded: false }
  ];

  onFileSelected(event: any, docId: number): void {
    if (event.target.files.length > 0) {
      const doc = this.docs.find(d => d.id === docId);
      if (doc) doc.uploaded = true;
    }
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