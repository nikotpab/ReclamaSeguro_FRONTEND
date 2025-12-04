import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../app/services/shared-data.service';
import { ApiService } from '../app/services/api.service'; 

@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class Register implements OnInit {
  accountForm: FormGroup;
  enviado: boolean = false;
  mostrarModal: boolean = false;
  passwordVisible: boolean = false;
  isSubmitting: boolean = false; // Para bloquear el botón mientras carga

  private datosService = inject(DatosCompartidosService);
  private apiService = inject(ApiService); // Inyectamos API
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.accountForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const datos = this.datosService.obtenerDatos();
    if (datos && datos.email) {
      this.accountForm.patchValue({ email: datos.email });
    }
  }

  // ... (Tus métodos de validación de contraseña, togglePassword, modales van aquí igual que antes) ...
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { mismatch: true } : null;
  }
  
  togglePasswordVisibility(): void { this.passwordVisible = !this.passwordVisible; }
  abrirModal(e: Event) { e.preventDefault(); this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; }
  aceptarTerminosDesdeModal() { this.accountForm.patchValue({ terms: true }); this.cerrarModal(); }

  // EL CAMBIO IMPORTANTE ESTÁ AQUÍ
  onSubmit(): void {
    this.enviado = true;

    if (this.accountForm.valid) {
      this.isSubmitting = true;
      const datosAcumulados = this.datosService.obtenerDatos();
      const formValues = this.accountForm.getRawValue(); // raw para obtener el email disabled

      // 1. Preparar datos del Usuario para el Backend
      const registerData = {
        email: formValues.email,
        password: formValues.password,
        fullName: datosAcumulados.nombre, // Viene de la Landing
        phone: datosAcumulados.telefono   // Viene de la Landing
      };

      console.log('Registrando usuario...');

      // 2. Llamada en cadena: Registrar Usuario -> Crear Consulta
      this.apiService.registerUser(registerData).subscribe({
        next: (userResponse) => {
          console.log('Usuario creado ID:', userResponse.id);
          
          // 3. Preparar datos de la Consulta con el ID del usuario
          const consultationData = {
            userId: userResponse.id,
            type: datosAcumulados.tipoConsulta || 'PROPIO', // Viene del Paso 1
            deceasedName: datosAcumulados.nombreFallecido,
            docType: datosAcumulados.tipoDocumento,
            docNumber: datosAcumulados.numeroDocumento,
            deathDate: datosAcumulados.fechaFallecimiento,
            kinship: datosAcumulados.parentesco
          };

          this.apiService.createConsultation(consultationData).subscribe({
            next: (consResponse) => {
              console.log('Consulta creada ID:', consResponse.id);
              
              this.datosService.guardarDatos({ consultationId: consResponse.id });
              
              this.router.navigate(['autorizar']);
            },
            error: (err) => {
              console.error('Error creando consulta', err);
              this.isSubmitting = false;
              alert('Error al crear el trámite. Intente nuevamente.');
            }
          });
        },
        error: (err) => {
          console.error('Error registrando usuario', err);
          this.isSubmitting = false;
          alert('El correo ya está registrado o hubo un error.');
        }
      });
    }
  }

  get f() { return this.accountForm.controls; }
}