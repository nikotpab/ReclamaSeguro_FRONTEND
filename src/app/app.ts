import { Component } from '@angular/core';
import { ConsultaSegurosComponent } from '../landing_page/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConsultaSegurosComponent],
  templateUrl: './app.html',
  styles: []
})
export class AppComponent {}