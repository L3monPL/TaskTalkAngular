import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyManagementService } from '../../../services/global/company-management.service';
import { UserDataService } from '../../../services/global/user-data.service';
import { EmojiPickerComponent } from '../../interface/emoji-picker/emoji-picker.component';
import { FileListChatComponent } from '../../interface/file-list-chat/file-list-chat.component';
import { FileService } from '../../../services/rest/file.service';

export interface ChatRoomMessage{
  id: number
  roomId: number
  userId: number|string
  username: string|null
  message: string|null
  fileId: number|null
  replyToId: number|null
  edited: boolean
  createdAt: string
  file?: {
    filename: string
    type: string
    data: string|null,
    imageWidth?: number
    imageHeight?: number
  },
  imageWidth?: number
  imageHeight?: number
}

@Component({
  selector: 'app-chat-room-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmojiPickerComponent,
    FileListChatComponent
  ],
  templateUrl: './chat-room-company.component.html',
  styleUrl: './chat-room-company.component.scss'
})
export class ChatRoomCompanyComponent implements OnInit, OnDestroy{

  constructor( 
    public websocketService: WebsocketService,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    public userDataService: UserDataService,
    private fileService: FileService
  ) { }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('textArea') private textArea!: ElementRef;

  ngOnInit(): void {
    this.checkUrl()
  }

  ngOnDestroy(): void {
    this.subRouteParam?.unsubscribe() 
    this.unsubscribeList()
  }

  idParam?: number
  subRouteParam?: Subscription

  checkUrl() {
    this.subRouteParam = this.route.paramMap.subscribe(params => {
      this.idParam = Number(params.get('id')!)
      console.log(this.idParam)

      this.messages = new Array()
      this.page = 0
      this.isDuplicateMessage = false

      this.unsubscribeList()

      this.joinTopicMessage()
    });
  }

  unsubscribeList(){
    this.subTopicRoom?.unsubscribe()
    this.subTopicRoomUser?.unsubscribe()
  }

  inputMessage?: string
  isDuplicateMessage = false
  messages: Array<ChatRoomMessage|any> = []

  subTopicRoom?: Subscription
  subTopicRoomUser?: Subscription

  joinTopicMessage(){

    // this.websocketService.stompClient.connect({}, ()=>{
      this.subTopicRoom = this.websocketService.stompClient.subscribe(`/topic/room/${this.idParam}`, (messages: any) => {
        const messageContent: ChatRoomMessage = JSON.parse(messages.body)
        console.log(messageContent)

        let file = null
          // if (messageContent.imageWidth && messageContent.imageHeight) {
            file = {
              filename: messageContent.file?.filename,
              type: messageContent.file?.type,
              data: null,
              imageWidth: messageContent.imageWidth,
              imageHeight: messageContent.imageHeight
            }
          // }

        let mappingMessage = {
          id: messageContent.id,
          roomId: messageContent.roomId,
          userId: messageContent.userId,
          username: this.companyManagementService.companyUserList?.find(user => user.id == messageContent.userId)?.username!,
          message: messageContent.message,
          fileId: messageContent.fileId,
          file: file,
          replyToId: messageContent.replyToId,
          edited: messageContent.edited,
          createdAt: messageContent.createdAt

        }
        this.messages!.push(mappingMessage)

        console.log(mappingMessage)

        if (mappingMessage.fileId) {
          this.getFileId(mappingMessage.fileId, mappingMessage.file) 
        }

        if (this.userDataService.getId() == messageContent.userId) {
          setTimeout(() => {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
          }, 0); 
        }
      })

      //get all messages by current user
      this.subTopicRoomUser = this.websocketService.stompClient.subscribe(`/user/topic/room/${this.idParam}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body)

        let pullMessageArray = new Array()

        let messageArray = this.messages

        messageContent.forEach((element: ChatRoomMessage) => {
          // console.log(element)

          let file = null
          file = {
            filename: element.file?.filename,
            type: element.file?.type,
            data: null,
            imageWidth: element.imageWidth,
            imageHeight: element.imageHeight
          }

          let mappingMessage = {
            id: element.id,
            roomId: element.roomId,
            userId: element.userId,
            username: this.companyManagementService.companyUserList?.find(user => user.id == element.userId)?.username!,
            message: element.message,
            fileId: element.fileId,
            file: file,
            replyToId: element.replyToId,
            edited: element.edited,
            createdAt: element.createdAt
  
          }
          // console.log(mappingMessage)
          pullMessageArray.push(mappingMessage)

          if (mappingMessage.fileId) {
            this.getFileId(mappingMessage.fileId, mappingMessage.file) 
          }
        });

        //sprawdzam duplikaty - to edit
        for (let index = 0; index < pullMessageArray!.length; index++) {
          if (messageArray[index]?.id == pullMessageArray[index]?.id) {
            this.isDuplicateMessage = true 
            return
          }
        }

        console.log(messageContent)
        //sprawdzam czy zwrociło mi nowe wiadomości, jeśli tak to pozwalam na pobieranie kolejnej strony
        if (messageContent && !this.isDuplicateMessage) {
          this.canLoadNextPage = true
        }


        const previousScrollPosition = this.scrollContainer?.nativeElement.scrollTop;
        // this.previousContentHeight = this.scrollContainer?.nativeElement.scrollHeight;
        const previousHeight = this.scrollContainer?.nativeElement.scrollHeight;

        if (!this.isDuplicateMessage) {
          this.messages = [...pullMessageArray, ...messageArray]
        }

        // Przewiń kontener do nowej pozycji
        setTimeout(() => {
          // Pobierz wysokość kontenera po dodaniu danych
          const newHeight = this.scrollContainer!.nativeElement.scrollHeight;

          // Oblicz różnicę w wysokości
          const heightDifference = newHeight - previousHeight + previousScrollPosition;

          this.scrollContainer!.nativeElement.scrollTop = heightDifference;
          console.log(this.scrollContainer!.nativeElement.scrollTop)
        }, 0);
      })
      this.connectToRoom()
  }

  connectToRoom(){
    this.websocketService.stompClient.send(`/app/ws/room/${this.idParam}/message`, {}, JSON.stringify(0))
  }

  sendMessage(event: any){
    console.log('test send message')
    // if (!this.inputMessage?.trim()) {
    //   return
    // }
    if (event.key === "Enter" && !event.shiftKey) {
  
      if (this.filesList?.length) {
        this.postMessageWithFileUpload()
        event.preventDefault();
        return
      }
      if (!this.filesList?.length && !this.inputMessage?.trim()) {
        console.log(this.filesList?.length)
        this.resetTextAreaStyle()
        // event.preventDefault();
        return
      }

      let messageResponse = {
        message: this.inputMessage
      }
      this.websocketService.stompClient.send(`/app/ws/room/${this.idParam}/sendMessage`, {}, JSON.stringify(messageResponse))
      this.inputMessage = ''
      console.log("this.inputMessage: " + this.inputMessage)

      this.resetTextAreaStyle()
      event.preventDefault();
    }
  }

  page = 0
  canLoadNextPage = true

  loadMoreMessages(){
    if (!this.canLoadNextPage) {
      return
    }
    this.page = this.page + 1
    this.canLoadNextPage = false
    this.loadPageMessageToRoom(this.page)
  }

  loadPageMessageToRoom(page: number){
    this.websocketService.stompClient.send(`/app/ws/room/${this.idParam}/message`, {}, JSON.stringify(page))
  }

  messageWithIcon(item: ChatRoomMessage){
    let messageIndex = this.messages.indexOf(item)

    if (!this.messages[messageIndex]?.createdAt ) {
      return false
    }

    let currentDate = new Date(this.messages[messageIndex]?.createdAt)
    let dateBack = new Date(this.messages[messageIndex - 1]?.createdAt)
    let dateNext = new Date(this.messages[messageIndex + 1]?.createdAt)

    if (!this.messages[messageIndex + 1]?.createdAt) {
      return true
    }

    if (Math.abs(currentDate.getTime() - dateNext.getTime()) > (5 * 60 * 1000)) {
      // if (this.messages[messageIndex + 1]?.userId != this.userDataService.getId()) {
      //   return true
      // }
      // else {
      //   return false
      // }
      return true
    } else {
      if (this.messages[messageIndex + 1]?.userId == this.userDataService.getId()) {
        return true
      }
      else {
        return false
      }
    }
  }

  messageWithoutIcon(item: ChatRoomMessage){
    let messageIndex = this.messages.indexOf(item)

    if (!this.messages[messageIndex]?.createdAt ) {
      return false
    }

    let currentDate = new Date(this.messages[messageIndex]?.createdAt)
    let dateBack = new Date(this.messages[messageIndex - 1]?.createdAt)
    let dateNext = new Date(this.messages[messageIndex + 1]?.createdAt)

    if (!this.messages[messageIndex + 1]?.createdAt) {
      return false
    }

    if (Math.abs(currentDate.getTime() - dateNext.getTime()) > (5 * 60 * 1000)) {
      return false
    } else {
      if (this.messages[messageIndex + 1]?.userId == this.userDataService.getId()) {
        return false
      }
      else {
        return true
      }
    }
  }

  messageWithUsername(item: ChatRoomMessage){
    let messageIndex = this.messages.indexOf(item)

    if (!this.messages[messageIndex]?.createdAt ) {
      return false
    }

    let currentDate = new Date(this.messages[messageIndex]?.createdAt)
    let dateBack = new Date(this.messages[messageIndex - 1]?.createdAt)
    let dateNext = new Date(this.messages[messageIndex + 1]?.createdAt)

    if (!this.messages[messageIndex - 1]?.createdAt) {
        return true
    }

    if (this.messages[messageIndex - 1].userId == this.userDataService.getId()) {
      return true
    }

    if (Math.abs(currentDate.getTime() - dateBack.getTime()) > (5 * 60 * 1000)) {
      return true
    } else {
      return false
    }
  }

  // previousScrollPosition: number = 0;
  // previousContentHeight: number = 0;

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    // Pobierz element, na którym wywołano zdarzenie scroll
    const element = this.scrollContainer.nativeElement

    if (element) {
      // Sprawdź wartość scrollTop dla tego elementu
      let scrollTop = element.scrollTop;

      // Jeśli scrollTop jest mniejszy niż 30, wykonaj jakąś akcję
      if (scrollTop < 30) {
        // Tutaj możesz wykonać jakieś działanie
        this.loadMoreMessages()
        // console.log('Scroll top is less than 300');
      } 
    }
  }

  lastLinesCount: number = 1

  onInput(event: any) {
    let area = event.target

    const lineHeight = parseInt(window.getComputedStyle(area).lineHeight);
    // const lines = area.value.split('\n').length;
    let diffByCurrentLines

    var lineNo = this.textArea.nativeElement.scrollHeight;
    var lineNo2 = this.textArea.nativeElement.clientHeight;
    var lines = ((this.textArea.nativeElement.scrollHeight) / 24);

    

    // area.value.substr(0, area.selectionStart).split(/\r?\n|\r/).length;
    // console.log("lineHeight" + lineHeight)
    console.log(lines)


    // const linesXD = area.value.split("/^/gm").length;
    // console.log(linesXD)
    if (!this.inputMessage) {
      area.style.height = (lineHeight * 1) + 'px';
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight + (lineHeight * (lines - 1)) + 'px'

      if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - lineHeight * 3
        // console.log('change scroll position')
      }
      // console.log('lines == 1 && area.clientHeight == 112')
      this.lastLinesCount = 1
    }






    if (lines <= 4) {
      diffByCurrentLines = this.lastLinesCount - lines
    }
    if (lines > 4) {
      diffByCurrentLines = this.lastLinesCount - 4
    }
    // console.log('diffByCurrentLines: ' + Math.abs(diffByCurrentLines!))
    let difBtwHeightAndLine = 0
    
    // --------------------------------------------------------------------------------- //
    // Sprawdź, czy wysokość tekstarea zmieniła się
    if (area.scrollHeight + difBtwHeightAndLine >= area.clientHeight + lineHeight && this.lastLinesCount <= 4) {
      area.style.height = (area.clientHeight + (lineHeight * Math.abs(diffByCurrentLines!))) + 'px'; // Rozszerz o jedną linię
      // console.log("area.style.height: " + area.style.height)
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight - (lineHeight * Math.abs(diffByCurrentLines!)) + 'px'
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop + (lineHeight * Math.abs(diffByCurrentLines!))

      this.lastLinesCount = lines
    }
    // --------------------------------------------------------------------------------- //
    else if (lines == 1 && area.clientHeight == 48 || lines == 2 && area.clientHeight == 72 || lines == 3 && area.clientHeight == 96) {
      area.style.height = (area.clientHeight - lineHeight) + 'px';
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight + lineHeight + 'px'
      
      if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - lineHeight
      }
      // console.log('lines == 1 && area.clientHeight == 60 || lines == 2 && area.clientHeight == 86 || lines == 3 && area.clientHeight == 112')
      this.lastLinesCount = lines
    }
    // --------------------------------------------------------------------------------- //
    // console.log(lines)
    // console.log(area.clientHeight)
    // --------------------------------------------------------------------------------- //
    if ((lines == 2 && area.clientHeight == 96) || (lines <= 2 && area.clientHeight == 72)) {

      area.style.height = (lineHeight * lines) + difBtwHeightAndLine + 'px';
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight + (lineHeight * 2) + 'px'

      if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - lineHeight * 2
        // console.log('change scroll position')
      }
      // console.log('lines == 2 && area.clientHeight == 112')
      this.lastLinesCount = lines
    }
    // --------------------------------------------------------------------------------- //
    if (lines == 1 && area.clientHeight == 96) {

      area.style.height = (lineHeight * lines) + difBtwHeightAndLine + 'px';
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight + (lineHeight * 3) + 'px'

      if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - lineHeight * 3
        // console.log('change scroll position')
      }
      // console.log('lines == 1 && area.clientHeight == 112')
      this.lastLinesCount = lines
    }
    // --------------------------------------------------------------------------------- //
  }

  resetTextAreaStyle(){
    let area = this.textArea.nativeElement
    let lineHeight = parseInt(window.getComputedStyle(area).lineHeight);
    let lines = area.value.split('\n').length;
    console.log(lines)
    console.log(lineHeight)

    const element = this.scrollContainer.nativeElement
    if (lines > 4) {
      lines = 4
    }
    element.style.height = this.scrollContainer.nativeElement.clientHeight + lineHeight * (lines - 1) + 'px'

    area.style.height = 24 + 'px';
    this.lastLinesCount = 1
  }

  openEmojiPanel: boolean = false

  addEmojiToChat(emoji: string){
    console.log(emoji)
    if (!this.inputMessage) {
      this.inputMessage = emoji
    }
    else{
      this.inputMessage = this.inputMessage + emoji
    }
  }

  filesList?: Array<any> = []
  isOpenFilePanel = false

  onFileSelected($event: any) {
    const files = $event.target.files;

    for (let index = 0; index < files.length; index++) {
      if (files[index].type.startsWith('image/')) {
        const reader: FileReader = new FileReader();
        reader.onload = () => {
          
          let imageFileObject = {
            image: reader.result,
            file: files[index]
          }
          this.filesList!.push(imageFileObject)
        }
        // };
        reader.readAsDataURL(files[index]);
      } else if (!files[index].type.startsWith('image/')) {

        let fileObject = {
          image: null,
          file: files[index]
        }

        this.filesList!.push(fileObject) 
      }

      if (!this.isOpenFilePanel) {
        this.isOpenFilePanel = true
        this.scrollContainer.nativeElement.style.height = this.scrollContainer.nativeElement.clientHeight - 78 + 'px'
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop + 78    
      }
    }
    console.log(this.filesList)
  }

  closeFileListPanel(){
    this.isOpenFilePanel = false
    this.scrollContainer.nativeElement.style.height = this.scrollContainer.nativeElement.clientHeight + 78 + 'px'
    if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - 78
    }
  }

  loadingPostMessageWithFile = false
  subUploadFile?: Subscription
  customErrorUploadFile?: string

  postMessageWithFileUpload(){
    if (!this.loadingPostMessageWithFile) {
      console.log(this.filesList![0].file)
      this.subUploadFile = this.fileService.postMessageWithFile(this.idParam!, this.filesList![0].file, this.inputMessage!).subscribe({
        next: (response) => {
          if(response){
            this.inputMessage = ''
            this.resetTextAreaStyle()
            this.closeFileListPanel()
          }
          else{
            this.customErrorUploadFile! = 'Brak obiektu odpowiedzi';
          }
        },
        error: (errorResponse) => {
          this.loadingPostMessageWithFile = false
          this.customErrorUploadFile = errorResponse.error
        },
        complete: () => {
          this.loadingPostMessageWithFile = false;
        }
      })
    }
  }

  subGetFile?: Subscription

  getFileId(fileId: number, file: any){
    // console.log('pobieram plik dla: ' + message)
    this.subGetFile = this.fileService.getFile(fileId!).subscribe({
      next: (response) => {
        if(response.body){

          // console.log(response.body)

          if (response.body?.type.startsWith('image')) {
            file.data = 'data:' + response.body?.type + ';base64,' + response.body?.data,
            file.filename = response.body?.filename!,
            file.type = response.body?.type!
          }
          else {
            console.log(response.body)
            // file.data = 'data:' + response.body?.type + ';base64,' + response.body?.data,
            file.filename = response.body?.filename!,
            file.type = response.body?.type!
          }
          

        }
        else{
          // this.customErrorUploadFile! = 'Brak obiektu odpowiedzi';
        }
      },
      error: (errorResponse) => {
        this.loadingPostMessageWithFile = false
        // this.customErrorUploadFile = errorResponse.error
      },
      complete: () => {
        this.loadingPostMessageWithFile = false;
      }
    })
  }

  getHeidhtImagePlaceholder(height: number, weight: number, elementRef: HTMLDivElement){
    // console.log(((elementRef.offsetWidth * height) / weight))
    return ((elementRef.offsetWidth * height) / weight)
  }

}
