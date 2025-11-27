import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../app/services/shared-data.service'

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

  private datosService = inject(DatosCompartidosService);

  constructor(
    private fb: FormBuilder, 
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this.datosService) {
      const datosGuardados = this.datosService.obtenerDatos();
      if (datosGuardados && datosGuardados.email) {
        this.accountForm.patchValue({ email: datosGuardados.email });
      }
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (confirmPassword?.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  abrirModal(event: Event): void {
    event.preventDefault();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  aceptarTerminosDesdeModal(): void {
    this.accountForm.patchValue({ terms: true });
    this.cerrarModal();
  }

  onSubmit(): void {
    this.enviado = true;
    if (this.accountForm.valid) {
      console.log('Cuenta creada:', this.accountForm.getRawValue());
      this.router.navigate(['autorizar']);
    }
  }

  get f() { return this.accountForm.controls; }
}