import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentPageComponent } from './main-content-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SideBarControlComponent } from '../../components/home/side-bar-control/side-bar-control.component';

const routes: Routes=[
  {
    path: '', 
    component:  MainContentPageComponent,
  }
]

@NgModule({
  declarations: [
    MainContentPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SideBarControlComponent
  ]
})
export class MainContentPageModule { }
