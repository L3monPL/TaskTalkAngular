import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Company{
  id: number
  name: string
  shortName: string
  createdAt: string
  enable: boolean
}
export interface UserCompany{
  id: number
  username: string
  email: string
  phone: string
  company_role: string
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private PATH = '/api/v1/company'

  constructor(
    private http: HttpClient
  ) { }

  //------------------------------------------------------------------------//
  // GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET//
  //------------------------------------------------------------------------//

  getCompanyList(): Observable<HttpResponse<Array<Company>>> {
    return this.http.get<Array<Company>>(this.PATH + `/list`, {
      observe: 'response',
      responseType: 'json'
    })
  }

  //------------------------------------------------------------------------//

  getCompanyUserList(companyId: number): Observable<HttpResponse<Array<UserCompany>>> {
    return this.http.get<Array<UserCompany>>(this.PATH + `/${companyId}/users`, {
      observe: 'response',
      responseType: 'json'
    })
  }

  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
  // POST POST POST POST POST POST POST POST POST POST POST POST POST POST  //
  //------------------------------------------------------------------------//

  postCompanyCreate(name: string, shortName: string): Observable<HttpResponse<Company>> {
    return this.http.post<Company>(this.PATH + `/create`,{
      name: name,
      shortName: shortName
    }, {
      observe: 'response',
      responseType: 'json'
    })
  }

  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
  // PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT//
  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
  // DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE  //
  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
}
