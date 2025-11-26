import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-consulta-seguros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class ConsultaSegurosComponent {
  consultaForm: FormGroup;
  enviado: boolean = false;

  constructor(private fb: FormBuilder) {
    this.consultaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.consultaForm.valid) {
      console.log(this.consultaForm.value);
      alert('Solicitud recibida');
      this.consultaForm.reset();
      this.enviado = false;
    }
  }

  get f() { return this.consultaForm.controls; }
}