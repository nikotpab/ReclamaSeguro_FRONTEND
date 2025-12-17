import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';
import { finalize } from 'rxjs/operators';
import { NgZone } from '@angular/core';


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
  showVerification: boolean = false; 
  private zone = inject(NgZone);

  
  loginForm: FormGroup;
  registerForm: FormGroup;
  verificationControl: FormControl; 
  
  passwordVisible: boolean = false;

  
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private datosService = inject(DatosCompartidosService);
  private cd = inject(ChangeDetectorRef); 

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

    this.verificationControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.showVerification = false;
    this.loginForm.reset();
    this.registerForm.reset();
    this.verificationControl.reset();
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

    this.apiService.login(credentials)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cd.detectChanges(); 
      }))
      .subscribe({
        next: (res: any) => {
          this.datosService.guardarDatos({ userId: res.id, email: res.email });
          
          if(credentials.email === 'admin@gmail.com' && credentials.password === '123456'){
            this.router.navigate(['/administrador']);
          } else {
            this.router.navigate(['/panel-usuario']);
          }
        },
        error: (err) => {
          alert(err.error?.error || 'Credenciales incorrectas o cuenta no verificada');
        }
      });
  }

  
  private handleRegister(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    const userData = this.registerForm.value;

    console.log("🚀 Enviando datos de registro...");

    this.apiService.registerUser(userData)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cd.detectChanges(); 
      }))
      .subscribe({
        next: () => {
  console.log("✅ Registro OK. Activando vista de código.");

  this.zone.run(() => {
    this.showVerification = true;
  });
},
        error: (err) => {
          console.error("❌ Error registro:", err);
          alert(err.error?.error || 'Error en el registro. Verifique los datos.');
        }
      });
  }

  
  verifyCode(): void {
    if (this.verificationControl.invalid) return;

    this.isSubmitting = true;
    const payload = {
      email: this.registerForm.get('email')?.value, 
      code: this.verificationControl.value
    };

    this.apiService.verifyUser(payload)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cd.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          alert('¡Cuenta verificada! Ahora inicia sesión.');
          
          this.showVerification = false;
          this.isLoginMode = true;
          this.cd.detectChanges();
        },
        error: (err) => {
          alert(err.error?.error || 'Código incorrecto');
        }
      });
  }

  get l() { return this.loginForm.controls; }
  get r() { return this.registerForm.controls; }
}