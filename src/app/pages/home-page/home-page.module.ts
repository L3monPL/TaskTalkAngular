import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { CompanyListNavBarComponent } from '../../components/interface/company-list-nav-bar/company-list-nav-bar.component';

const routes: Routes=[
  {
    path: '', 
    component:  HomePageComponent,
    children: [
      {
        path: 'company/:id',
        loadChildren: () => import('../main-content-page/main-content-page.module').then(c=>c.MainContentPageModule),
      },
      // {
      //   path: 'produkty',
      //   loadChildren: () => import('../products-list-search-page/products-list-search-page.module').then(c=>c.ProductsListSearchPageModule),
      // },
      // {
      //   path: 'koszyk',
      //   loadComponent: () => import('../shopping-cart-page/shopping-cart-page.component').then(c=>c.ShoppingCartPageComponent),
      // },
      // {
      //   path: 'produkt/:code',
      //   loadComponent: () => import('../product-page/product-page.component').then(c=>c.ProductPageComponent),
      // },
      // {
      //   path: 'profil',
      //   loadChildren: () => import('../profile-page/profile-page.module').then(c=>c.ProfilePageModule),
      // },
    ]
    
  }
]

@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CompanyListNavBarComponent
  ]
})
export class HomePageModule { }
