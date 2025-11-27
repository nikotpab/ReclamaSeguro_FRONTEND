import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class Authorization implements AfterViewInit {
  @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  signatureForm: FormGroup;
  private cx!: CanvasRenderingContext2D | null;
  
  isDrawing = false;
  hasSigned = false;
  mostrarModal = false;
  enviado = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signatureForm = this.fb.group({
      authorization: [false, Validators.requiredTrue]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const canvasEl: HTMLCanvasElement = this.canvasRef.nativeElement;
      this.cx = canvasEl.getContext('2d');
      
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;

      if (this.cx) {
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
      }
    }, 100);

    window.addEventListener('resize', () => {
      const canvasEl = this.canvasRef.nativeElement;
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;
      
      if (this.cx) {
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
      }
    });
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    const { x, y } = this.getPosition(event);
    this.cx?.beginPath();
    this.cx?.moveTo(x, y);
    event.preventDefault(); 
  }

  draw(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing) return;
    const { x, y } = this.getPosition(event);
    this.cx?.lineTo(x, y);
    this.cx?.stroke();
    this.hasSigned = true;
    event.preventDefault();
  }

  stopDrawing(): void {
    this.isDrawing = false;
    this.cx?.closePath();
  }

  getPosition(event: MouseEvent | TouchEvent): { x: number, y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  clearSignature(): void {
    const canvas = this.canvasRef.nativeElement;
    this.cx?.clearRect(0, 0, canvas.width, canvas.height);
    this.hasSigned = false;
  }

  abrirDocumento(e: Event): void {
    e.preventDefault();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.signatureForm.valid && this.hasSigned) {
      const backendData = {
        autorizacion_firmada: true,
        timestamp: new Date().toISOString()
      };
      
      console.log('Firma enviada:', backendData);
      
      this.router.navigate(['pago']);
    }
  }

  get f() { return this.signatureForm.controls; }
}