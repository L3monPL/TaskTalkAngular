import { Routes } from '@angular/router';

export const routes: Routes = [
    //zachować kolejność (ładowanie app)
    {
        path: 'app',
        loadChildren: () => import('./pages/home-page/home-page.module').then(c=>c.HomePageModule),
        // canLoad: [CheckLoginGuard]
    },
    {
        path: '',
        loadChildren: () => import('./pages/login-page/login-page.module').then(c=>c.LoginPageModule)
    }
];
