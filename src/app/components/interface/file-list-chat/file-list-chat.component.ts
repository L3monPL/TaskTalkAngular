import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-list-chat',
  standalone: true,
  imports: [],
  templateUrl: './file-list-chat.component.html',
  styleUrl: './file-list-chat.component.scss'
})
export class FileListChatComponent {

  @Input() fileList?: Array<any>

  @Output() closeFileList = new EventEmitter<any>();

  removeFile(index: number){
    this.fileList?.splice(index, 1)
    console.log(this.fileList)

    if (!this.fileList?.length) {
      this.closeFileList.emit()
    }
  }

}
