import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsCompanyPageComponent } from './settings-company-page.component';

const routes: Routes=[
  {
    path: '', 
    component:  SettingsCompanyPageComponent,
    // children: [
    //   {
    //     path: '',
    //     loadComponent: () => import('../../components/home/start-page-company/start-page-company.component').then(c=>c.StartPageCompanyComponent),
    //   },
    //   {
    //     path: 'chat/:id',
    //     loadComponent: () => import('../../components/home/chat-room-company/chat-room-company.component').then(c=>c.ChatRoomCompanyComponent),
    //   }
    // ]
  }
]

@NgModule({
  declarations: [
    SettingsCompanyPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class SettingsCompanyPageModule { }
