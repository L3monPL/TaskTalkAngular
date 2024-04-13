import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyRoom, RoomService } from '../../services/rest/room.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../services/rest/company.service';
import { CompanyManagementService } from '../../services/global/company-management.service';

@Component({
  selector: 'app-main-content-page',
  standalone: false,
  templateUrl: './main-content-page.component.html',
  styleUrl: './main-content-page.component.scss'
})
export class MainContentPageComponent implements OnInit{

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    public companyManagement: CompanyManagementService
  ) { }

  ngOnInit(): void {
    this.checkUrl()
  }

  idParam?: number

  checkUrl() {
    this.route.paramMap.subscribe(params => {
      this.idParam = Number(params.get('id')!)

      //czyścimy przy kadej zmianie parametru
      this.subCompanyChatRoomList?.unsubscribe()
      this.loadingCompanyChatRoomList = false
      this.customErrorCompanyChatRoomList = ''
      this.companyChatRoomList = new Array()

      this.companyManagement.subCompanyUserList?.unsubscribe()
      this.companyManagement.loadingCompanyUserList = false
      this.companyManagement.customErrorCompanyUserList = ''
      this.companyManagement.companyUserList = new Array()

      //pobieramy dane / nowe dane
      this.getCompanyChatRoomList(this.idParam)
      this.companyManagement.getCompanyUserList(this.idParam)
    });
  }

  subCompanyChatRoomList?: Subscription
  loadingCompanyChatRoomList = false
  customErrorCompanyChatRoomList?: string
  companyChatRoomList?: Array<CompanyRoom>

  getCompanyChatRoomList(companyId: number){
    this.subCompanyChatRoomList = this.roomService.getCompanyChatRoomList(companyId).subscribe({
      next: (response) => {
        if(response.body){
          this.loadingCompanyChatRoomList = false
          this.companyChatRoomList = response.body
          // console.log(this.companyChatRoomList)
        }
        else{
          this.customErrorCompanyChatRoomList! = 'Brak obiektu odpowiedzi';
        }
      },
      error: (errorResponse) => {
        this.loadingCompanyChatRoomList = false
        this.customErrorCompanyChatRoomList = errorResponse.error
      },
      complete: () => {
        this.loadingCompanyChatRoomList = false;
      }
    })
  }


}
