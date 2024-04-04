import { Component, Input } from '@angular/core';
import { CompanyRoom } from '../../../services/rest/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar-control',
  standalone: true,
  imports: [],
  templateUrl: './side-bar-control.component.html',
  styleUrl: './side-bar-control.component.scss'
})
export class SideBarControlComponent {

  @Input() companyChatRoomList?: Array<CompanyRoom>
  @Input() companyId?: number

  constructor( 
    private router: Router
  ) { }

  selectChatRoom(chatRoomId: number){
    this.router.navigate([`/app/company/${this.companyId}/chat/${chatRoomId}`])
  }

}
