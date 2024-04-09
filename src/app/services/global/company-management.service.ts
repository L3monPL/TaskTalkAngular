import { EventEmitter, Injectable } from '@angular/core';
import { Company, CompanyService, UserCompany } from '../rest/company.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyManagementService {

  constructor(
    private companyService: CompanyService,
  ) { }

  //EMITTERY

  companyListEmitter: EventEmitter<any> = new EventEmitter()
  getCompanyListEmitterByCreate(company: Company){
    this.companyListEmitter.emit(company)
  }

  // lista użytkowników którzy znajdują sie w wybranej aktualnie firmie

  subCompanyUserList?: Subscription
  loadingCompanyUserList = false
  customErrorCompanyUserList?: string
  companyUserList?: Array<UserCompany>

  getCompanyUserList(companyId: number){
    this.subCompanyUserList = this.companyService.getCompanyUserList(companyId).subscribe({
      next: (response) => {
        if(response.body){
          this.loadingCompanyUserList = false
          this.companyUserList = response.body
          console.log(this.companyUserList)
        }
        else{
          this.customErrorCompanyUserList! = 'Brak obiektu odpowiedzi';
        }
      },
      error: (errorResponse) => {
        this.loadingCompanyUserList = false
        this.customErrorCompanyUserList = errorResponse.error
      },
      complete: () => {
        this.loadingCompanyUserList = false;
      }
    })
  }

}
