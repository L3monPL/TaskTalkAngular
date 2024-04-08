import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company, CompanyService } from '../../services/rest/company.service';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { AuthService } from '../../services/rest/auth.service';
import { UserDataService } from '../../services/global/user-data.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit{

  constructor(
    private companyService: CompanyService,
    public websocketService: WebsocketService,
    private authService: AuthService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.websocketService.connect()
    this.getCompanyList()
    this.getUser()
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

  subValidateIsLogin?: Subscription
  loadingValidateIsLogin = true
  customErrorValidateIsLogin?: string

  getUser(){
    this.subValidateIsLogin = this.authService.getUser().subscribe({
      next: (response) => {
        if(response.body){
          this.loadingValidateIsLogin = false
          console.log(response.body)
          this.userDataService.setUser(response.body)
        }
        else{
          this.customErrorValidateIsLogin! = 'Brak obiektu odpowiedzi';
        }
      },
      error: (errorResponse) => {
        this.loadingValidateIsLogin = false
        this.customErrorValidateIsLogin = errorResponse.error
      },
      complete: () => {
        this.loadingValidateIsLogin = false;
      }
    })
  }

}
