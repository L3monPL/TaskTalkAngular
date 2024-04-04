import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/login-page/login-page.module').then(c=>c.LoginPageModule)
    },
    {
        path: 'app',
        loadChildren: () => import('./pages/home-page/home-page.module').then(c=>c.HomePageModule),
        // canLoad: [CheckLoginGuard]
    },
];
