import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contrato-mandato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class ContratoMandatoComponent implements AfterViewInit {
  @ViewChild('contractCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private cx!: CanvasRenderingContext2D | null;
  private router = inject(Router);
  
  isDrawing = false;
  hasSigned = false;
  showModal = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const canvasEl = this.canvasRef.nativeElement;
      this.cx = canvasEl.getContext('2d');
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;
      if (this.cx) {
        this.cx.lineWidth = 2;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
      }
    }, 100);
  }

  startDrawing(e: any): void {
    this.isDrawing = true;
    const { x, y } = this.getPos(e);
    this.cx?.beginPath();
    this.cx?.moveTo(x, y);
    e.preventDefault();
  }

  draw(e: any): void {
    if (!this.isDrawing) return;
    const { x, y } = this.getPos(e);
    this.cx?.lineTo(x, y);
    this.cx?.stroke();
    this.hasSigned = true;
    e.preventDefault();
  }

  stopDrawing(): void { this.isDrawing = false; this.cx?.closePath(); }

  getPos(e: any): {x: number, y: number} {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  toggleModal(val: boolean): void { this.showModal = val; }

  clearSignature(): void {
    this.cx?.clearRect(0,0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.hasSigned = false;
  }

  firmar(): void {
    if (this.hasSigned) {
      // Aquí lógica de backend: guardar firma, mandato_firmado = true
      console.log('Mandato firmado');
      this.router.navigate(['/seguimiento']);
    }
  }
}