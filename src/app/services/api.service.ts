import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api'; // Tu backend

  // 1. Registrar Usuario
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // 2. Crear Consulta (Trámite)
  createConsultation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/consultations/create`, data);
  }

  // 3. Subir Firma (Ya lo usamos en el componente, pero es bueno tenerlo aquí)
  uploadSignature(id: number, signatureBase64: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/consultations/${id}/sign`, { base64Signature: signatureBase64 });
  }

  // 4. Procesar Pago
  processPayment(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/consultations/${id}/pay`, {});
  }
}