import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/rest/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit{

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    // this.validationIsLogin()
  }

  subValidateIsLogin?: Subscription
  loadingValidateIsLogin = false
  customErrorValidateIsLogin?: string

  validationIsLogin(){
    this.subValidateIsLogin = this.authService.getUserAuth().subscribe({
      next: (response) => {
        if(response.body){
          this.loadingValidateIsLogin = false
          this.router.navigate([`/app`])
        }
        else{
          this.customErrorValidateIsLogin! = 'Brak obiektu odpowiedzi';
        }
      },
      error: (errorResponse) => {
        this.loadingValidateIsLogin = false
        this.customErrorValidateIsLogin = errorResponse.error
      },
      complete: () => {
        this.loadingValidateIsLogin = false;
      }
    })
  }
}
