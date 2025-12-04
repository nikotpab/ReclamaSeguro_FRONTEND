import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DatosCompartidosService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  guardarDatos(datos: any) {
    if (this.isBrowser) {
      const datosActuales = this.obtenerDatos();
      const nuevosDatos = { ...datosActuales, ...datos };
      localStorage.setItem('datosReclamaSeguro', JSON.stringify(nuevosDatos));
    }
  }

  obtenerDatos() {
    if (this.isBrowser) {
      const datosGuardados = localStorage.getItem('datosReclamaSeguro');
      return datosGuardados ? JSON.parse(datosGuardados) : {};
    }
    return {}; 
  }
  
  limpiarDatos() {
    if (this.isBrowser) {
      localStorage.removeItem('datosReclamaSeguro');
    }
  }
}