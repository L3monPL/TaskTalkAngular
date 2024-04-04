import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';
import { AuthInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, 
        disableImageLazyLoadWarning: true
      }
    },
    provideHttpClient(withInterceptorsFromDi()),  
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
};
