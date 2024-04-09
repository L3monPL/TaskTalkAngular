import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsCompanyPageComponent } from './settings-company-page.component';
import { SettingsCompanyNavComponent } from '../../components/settingsCompany/settings-company-nav/settings-company-nav.component';

const routes: Routes=[
  {
    path: '', 
    component:  SettingsCompanyPageComponent,
    children: [
      {
        path: 'users-list',
        loadComponent: () => import('../../components/settingsCompany/settings-company-users-list/settings-company-users-list.component').then(c=>c.SettingsCompanyUsersListComponent),
      },
      {
        path: 'invite-users',
        loadComponent: () => import('../../components/settingsCompany/settings-company-invite-users/settings-company-invite-users.component').then(c=>c.SettingsCompanyInviteUsersComponent),
      }
    ]
  }
]

@NgModule({
  declarations: [
    SettingsCompanyPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SettingsCompanyNavComponent
  ]
})
export class SettingsCompanyPageModule { }
