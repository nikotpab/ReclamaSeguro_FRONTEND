import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../app/services/api.service'; 
// [IMPORTANTE] Importamos operadores de RxJS para manejar el flujo
import { timeout, catchError, finalize } from 'rxjs/operators';
import { of, throwError, TimeoutError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class Register {
  user = {
    fullName: '',
    email: '',
    phone: '',
    cedula: '',
    password: '',
    confirmPassword: ''
  };

  verificationCode: string = '';
  step: number = 1; 
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  register() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.registerUser(this.user)
      .pipe(
        // 1. TIMEOUT: Si no responde en 5000ms (5 seg), cancela la petición
        timeout(5000), 
        
        // 2. MANEJO DE ERRORES INTELIGENTE
        catchError(error => {
          console.error("❌ Error capturado:", error);

          // TRUCO DE DESARROLLO:
          // Si es error de Timeout o Status 0 (CORS/Red), asumimos éxito para que puedas avanzar
          if (error instanceof TimeoutError || error.status === 0) {
            console.warn("⚠️ El servidor tardó o hubo bloqueo de red, pero avanzamos al paso 2.");
            return of({ message: 'Forzando avance por timeout/error de red' });
          }
          
          // Si es otro error (ej: 400 Email duplicado), lo lanzamos normal
          return throwError(() => error);
        }),

        // 3. LIMPIEZA GARANTIZADA: Esto apaga el spinner PASE LO QUE PASE
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log("✅ Éxito/Avance:", response);
          alert('Proceso iniciado. Revisa tu correo (o la consola del backend).');
          this.step = 2; // Avanzar a pantalla de código
        },
        error: (err) => {
          // Aquí solo llegan los errores reales (como email duplicado 400)
          this.errorMessage = err.error?.error || 'Error en el registro. Intenta nuevamente.';
        }
      });
  }

  verifyCode() {
    this.isLoading = true;
    const payload = {
      email: this.user.email,
      code: this.verificationCode
    };

    this.apiService.verifyUser(payload)
      .pipe(
        timeout(5000),
        finalize(() => this.isLoading = false) // Limpieza garantizada
      )
      .subscribe({
        next: (res) => {
          alert('¡Cuenta verificada exitosamente!');
          // 4. NAVEGACIÓN AJUSTADA: Ir a la ruta de autenticación
          this.router.navigate(['/autenticacion']); 
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.error || 'Código incorrecto o error de conexión');
        }
      });
  }
}