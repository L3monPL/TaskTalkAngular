import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-list-chat',
  standalone: true,
  imports: [],
  templateUrl: './file-list-chat.component.html',
  styleUrl: './file-list-chat.component.scss'
})
export class FileListChatComponent {

  @Input() fileList?: Array<any>

}
