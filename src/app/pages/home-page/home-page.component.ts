import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company, CompanyService } from '../../services/rest/company.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit{

  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.getCompanyList()
  }

  subCompanyList?: Subscription
  loadingCompanyList = false
  customErrorCompanyList?: string
  companyList?: Array<Company>

  getCompanyList(){
    this.subCompanyList = this.companyService.getCompanyList().subscribe({
      next: (response) => {
        if(response.body){
          this.loadingCompanyList = false
          this.companyList = response.body
        }
        else{
          this.customErrorCompanyList! = 'Brak obiektu odpowiedzi';
        }
      },
      error: (errorResponse) => {
        this.loadingCompanyList = false
        this.customErrorCompanyList = errorResponse.error
      },
      complete: () => {
        this.loadingCompanyList = false;
      }
    })
  }

}
