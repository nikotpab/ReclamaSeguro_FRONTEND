import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosCompartidosService {
  
  constructor() { }

  guardarDatos(datos: any) {
    const datosActuales = this.obtenerDatos();
    
    const nuevosDatos = { ...datosActuales, ...datos };
    
    localStorage.setItem('datosReclamaSeguro', JSON.stringify(nuevosDatos));
  }

  obtenerDatos() {
    const datosGuardados = localStorage.getItem('datosReclamaSeguro');
    
    return datosGuardados ? JSON.parse(datosGuardados) : {};
  }
  
  limpiarDatos() {
    localStorage.removeItem('datosReclamaSeguro');
  }
}