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

  //------------------------------------------------------------------------//
  // POST POST POST POST POST POST POST POST POST POST POST POST POST POST  //
  //------------------------------------------------------------------------//

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
