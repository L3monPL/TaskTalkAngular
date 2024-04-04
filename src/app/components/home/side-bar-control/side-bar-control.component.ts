import { Component, Input } from '@angular/core';
import { CompanyRoom } from '../../../services/rest/room.service';

@Component({
  selector: 'app-side-bar-control',
  standalone: true,
  imports: [],
  templateUrl: './side-bar-control.component.html',
  styleUrl: './side-bar-control.component.scss'
})
export class SideBarControlComponent {

  @Input() companyChatRoomList?: Array<CompanyRoom>

}
