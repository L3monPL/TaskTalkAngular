import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../../components/login/sign-in/sign-in.component';

const routes: Routes=[
  {
    path: '', 
    component:  LoginPageComponent,
    children: [
      {
        path: 'login',
        component: SignInComponent
      },
      // {
      //   path: 'przypomnij-haslo',
      //   loadComponent: () => import('../../components/login/remind-password/remind-password.component').then(c=>c.RemindPasswordComponent)
      // },
      // {
      //   path: 'rejestracja',
      //   loadComponent: () => import('../../components/login/register/register.component').then(c=>c.RegisterComponent)
      // },
      // {
      //   path: 'reset-hasla/:code',
      //   loadComponent: () => import('../../components/login/reset-password/reset-password.component').then(c=>c.ResetPasswordComponent)
      // },
      // {
      //   path: 'aktywacja-konta/:code',
      //   loadComponent: () => import('../../components/login/active-account/active-account.component').then(c=>c.ActiveAccountComponent)
      // },
      { path: '**', redirectTo: 'login', pathMatch:'full'}
    ]
  }
]

@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class LoginPageModule { }
