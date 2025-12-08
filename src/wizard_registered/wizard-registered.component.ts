import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service'
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-wizard-registered',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wizard-registered.component.html',
  styleUrls: ['./wizard-registered.component.css']
})
export class WizardComponentRegistered {
  consultaForm: FormGroup;
  enviado: boolean = false;
  isSubmitting: boolean = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);
  
  
  private datosService = inject(DatosCompartidosService);

  constructor() {
    this.consultaForm = this.fb.group({
      tipoConsulta: ['', Validators.required],
      nombreFallecido: ['', Validators.required],
      tipoDocumento: ['CC', Validators.required],
      numeroDocumento: ['', Validators.required],
      fechaFallecimiento: ['', Validators.required],
      parentesco: ['', Validators.required]
    });
  }

  get f() { 
    return this.consultaForm.controls; 
  }

  get tipoConsulta() {
    return this.consultaForm.get('tipoConsulta')?.value;
  }

  seleccionarTipo(tipo: string): void {
    this.consultaForm.patchValue({ tipoConsulta: tipo });
    
    
    if (tipo === 'propio') {
       
    }
  }

  onSubmit(): void {
    this.enviado = true;

    
    
    if (this.tipoConsulta === 'fallecido' && this.consultaForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    
    const datosUsuario = this.datosService.obtenerDatos() as any;
    
    if (!datosUsuario || !datosUsuario.userId) {
      alert('Su sesión ha expirado.');
      this.router.navigate(['/auth']);
      return;
    }

    const formValues = this.consultaForm.value;
    
    const consultationData = {
      userId: datosUsuario.userId,
      type: formValues.tipoConsulta,
      deceasedName: formValues.nombreFallecido,
      docType: formValues.tipoDocumento,
      docNumber: formValues.numeroDocumento,
      deathDate: formValues.fechaFallecimiento,
      kinship: formValues.parentesco
    };

    console.log('Enviando consulta...', consultationData);

    this.api.createConsultation(consultationData).subscribe({
      next: (res: any) => {
        console.log('ID Creado:', res.id);
        
        this.datosService.guardarDatos({ 
          consultationId: res.id,
          nombreFallecido: formValues.nombreFallecido 
        });

        this.router.navigate(['autorizar']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al crear trámite.');
        this.isSubmitting = false;
      }
    });
  }
}