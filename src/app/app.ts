import { Component } from '@angular/core';
import { ConsultaSegurosComponent } from '../landing_page/home.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styles: []
})
export class AppComponent {}