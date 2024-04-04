import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';

const routes: Routes=[
  {
    path: '', 
    component:  HomePageComponent,
    // children: [
    //   {
    //     path: '',
    //     loadChildren: () => import('../home-page/home-page.module').then(c=>c.HomePageModule),
    //   },
    //   {
    //     path: 'produkty',
    //     loadChildren: () => import('../products-list-search-page/products-list-search-page.module').then(c=>c.ProductsListSearchPageModule),
    //   },
    //   {
    //     path: 'koszyk',
    //     loadComponent: () => import('../shopping-cart-page/shopping-cart-page.component').then(c=>c.ShoppingCartPageComponent),
    //   },
    //   {
    //     path: 'produkt/:code',
    //     loadComponent: () => import('../product-page/product-page.component').then(c=>c.ProductPageComponent),
    //   },
    //   {
    //     path: 'profil',
    //     loadChildren: () => import('../profile-page/profile-page.module').then(c=>c.ProfilePageModule),
    //   },
    //   { path: '**', redirectTo: '', pathMatch:'full'}
    // ]
  }
]

@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class HomePageModule { }
