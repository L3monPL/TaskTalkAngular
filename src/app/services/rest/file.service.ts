import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private PATH = '/api/v1/file'

  constructor(
    private http: HttpClient
  ) { }

  //------------------------------------------------------------------------//
  // GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET//
  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//

  //------------------------------------------------------------------------//
  // POST POST POST POST POST POST POST POST POST POST POST POST POST POST  //
  //------------------------------------------------------------------------//

  postMessageWithFile(
    roomId: number,
    file: File,
    message: string
  ): Observable<HttpResponse<any>> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data'
    // });
    const formData = new FormData();
    if (file) {
      formData.append('file', file)
    }
    if (message) {
      formData.append('message', message);
    }
    return this.http.post<any>(this.PATH + `/${roomId}/upload`,  formData, {
      observe: 'response',
      responseType: 'json',
      // headers: headers
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
