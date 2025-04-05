import { Component } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
@Component({
  selector: 'app-authentication',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public auth: AuthService) {
  }

}

