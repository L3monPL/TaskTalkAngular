import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserLogin{
  login: string
  password: string
}
export interface UserAuth{
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private PATH = '/api/v1/auth'

  constructor(
    private http: HttpClient
  ) { }

  //------------------------------------------------------------------------//
  // GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET//
  //------------------------------------------------------------------------//

  getUserAuth(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.PATH + `/validate`, {
      observe: 'response',
      responseType: 'json'
    })
  }

  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
  // POST POST POST POST POST POST POST POST POST POST POST POST POST POST  //
  //------------------------------------------------------------------------//

  postUserLogin(
    login: string,
    password: string,
  ): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.PATH + `/login`, {
      login: login,
      password: password
    }, {
      observe: 'response',
      responseType: 'json'
    })
  }

  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
  // PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT//
  //------------------------------------------------------------------------//

  // putUserAccountChangePassword(
  //   oldPassword: string,
  //   newPassword: string
  // ): Observable<HttpResponse<Message>> {
  //   return this.http.put<Message>(this.PATH + `/Change/Password`,{
  //     oldPassword: oldPassword,
  //     newPassword: newPassword
  //   }, {
  //     observe: 'response',
  //     responseType: 'json'
  //   })
  // }

  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
  // DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE  //
  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
}
