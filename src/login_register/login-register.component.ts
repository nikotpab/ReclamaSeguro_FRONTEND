import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})


export class AuthComponent {
  isLoginMode: boolean = true;
  isSubmitting: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  passwordVisible: boolean = false;

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private datosService = inject(DatosCompartidosService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      cedula: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin(): void {
    if (this.loginForm.invalid) return;
    
    this.isSubmitting = true;
    const credentials = this.loginForm.value;

   

    this.apiService.login(credentials).subscribe({
      next: (res: any) => {
        this.datosService.guardarDatos({ 
          userId: res.id, 
          email: res.email 
        });
        
        console.log('Login exitoso:', res);
         if(credentials.email=='admin@gmail.com'&&credentials.password=='123456'){
        this.router.navigate(['/administrador']);
        return;
    }
        this.router.navigate(['/panel-usuario']);
      },
      error: (err) => {
        console.error(err);
        alert('Credenciales incorrectas');
        this.isSubmitting = false;
      }
    });
  }

  private handleRegister(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    const userData = this.registerForm.value;

    this.apiService.registerUser(userData).subscribe({
      next: (res) => {
        this.datosService.guardarDatos({ userId: res.id, email: userData.email });
        this.isSubmitting = false;
        this.router.navigate(['panel-usuario']);
      },
      error: (err) => {
        alert('Error en el registro. Verifique los datos.');
        this.isSubmitting = false;
      }
    });
  }

  get l() { return this.loginForm.controls; }
  get r() { return this.registerForm.controls; }
}