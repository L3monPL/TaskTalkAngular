import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/rest/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  loginForm = new FormGroup({
    login: new FormControl ('', [Validators.required]),
    password: new FormControl ('', [Validators.required])
  })

  subLogin?: Subscription
  loading = false
  customErrorLogin?: string
  checkValidForm = false

  submit(){
    this.checkValidForm = true

    if (!this.loading && this.loginForm.valid) {
      let timeoutId = setTimeout(() => {this.loading = true}, 300)
      let loginValue = this.loginForm.get('login')!.value;
      let passwordValue = this.loginForm.get('password')!.value;

      this.subLogin = this.authService.postUserLogin(loginValue!.trim(), passwordValue!.trim()).subscribe({
        next: (response) => {
          if(response.body){
            clearTimeout(timeoutId)
            this.loading = false
            this.router.navigate([`/app`])
          }
          else{
            this.customErrorLogin! = 'Brak obiektu odpowiedzi';
          }
        },
        error: (errorResponse) => {
          clearTimeout(timeoutId)
          this.loading = false
          this.customErrorLogin = errorResponse.error
        },
        complete: () => {
          clearTimeout(timeoutId)
          this.loading = false;
        }
      })
    }
  }
}
