import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(
        private router: Router
    ){

    }

    intercept(request: HttpRequest<any>, next: any) {  
      //   let token = localStorage.getItem('auth_app_token_mb2b_web')
      //  if (token) {
      //    request = request.clone({
      //       setHeaders: {Authorization: `${token}`}
      //    });
      // }
    
      return next.handle(request).pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                // redirect user to the logout page
                this.router.navigate(['login'])
             }
          }
          return throwError(err);
        })
       )
      }










    // intercept(req: HttpRequest<any>, next: HttpHandler) {
    //     return next.handle(req).pipe(
    //       catchError((error: HttpErrorResponse) => {
    //         if (error.status === 401) {
    //           this.router.navigate(['/login']);
    //         }
    //         if (error.status === 403) {
    //             this.router.navigate(['/login']);
    //           }
    //         throw error;
    //       })
    //     );
    //   }
}