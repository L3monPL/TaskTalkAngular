import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyManagementService } from '../../../services/global/company-management.service';
import { UserDataService } from '../../../services/global/user-data.service';

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
}

@Component({
  selector: 'app-chat-room-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-room-company.component.html',
  styleUrl: './chat-room-company.component.scss'
})
export class ChatRoomCompanyComponent implements OnInit, OnDestroy{

  constructor( 
    public websocketService: WebsocketService,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    public userDataService: UserDataService
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
  messages: Array<ChatRoomMessage> = []

  subTopicRoom?: Subscription
  subTopicRoomUser?: Subscription

  joinTopicMessage(){

    // this.websocketService.stompClient.connect({}, ()=>{
      this.subTopicRoom = this.websocketService.stompClient.subscribe(`/topic/room/${this.idParam}`, (messages: any) => {
        const messageContent: ChatRoomMessage = JSON.parse(messages.body)
        console.log(messageContent)
        let mappingMessage = {
          id: messageContent.id,
          roomId: messageContent.roomId,
          userId: messageContent.userId,
          username: this.companyManagementService.companyUserList?.find(user => user.id == messageContent.userId)?.username!,
          message: messageContent.message,
          fileId: messageContent.fileId,
          replyToId: messageContent.replyToId,
          edited: messageContent.edited,
          createdAt: messageContent.createdAt

        }
        this.messages!.push(mappingMessage)
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
          let mappingMessage = {
            id: element.id,
            roomId: element.roomId,
            userId: element.userId,
            username: this.companyManagementService.companyUserList?.find(user => user.id == element.userId)?.username!,
            message: element.message,
            fileId: element.fileId,
            replyToId: element.replyToId,
            edited: element.edited,
            createdAt: element.createdAt
  
          }
          pullMessageArray.push(mappingMessage)
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
    if (!this.inputMessage?.trim()) {
      return
    }
    if (event.key === "Enter" && !event.shiftKey) {
  
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

      // Jeśli scrollTop jest mniejszy niż 200, wykonaj jakąś akcję
      if (scrollTop < 30) {
        // Tutaj możesz wykonać jakieś działanie
        this.loadMoreMessages()
        // console.log('Scroll top is less than 300');
      } 
    }
  }

  lastLinesCount: number = 1

  onInput(event: any) {
    const inputText = (event.target as HTMLInputElement).value;
    console.log('lastLinesCount: ' + this.lastLinesCount)

    let area = event.target

    const lineHeight = parseInt(window.getComputedStyle(area).lineHeight);
    const lines = area.value.split('\n').length;
    let diffByCurrentLines

    if (lines <= 4) {
      diffByCurrentLines = this.lastLinesCount - lines
    }
    if (lines > 4) {
      diffByCurrentLines = this.lastLinesCount - 4
    }
    console.log('diffByCurrentLines: ' + Math.abs(diffByCurrentLines!))
    let difBtwHeightAndLine = 8
    
    // Sprawdź, czy wysokość tekstarea zmieniła się
    if (area.scrollHeight + difBtwHeightAndLine >= area.clientHeight + lineHeight && this.lastLinesCount <= 4) {
      area.style.height = (area.clientHeight + (lineHeight * Math.abs(diffByCurrentLines!))) + 'px'; // Rozszerz o jedną linię
      console.log("area.style.height: " + area.style.height)
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight - (lineHeight * Math.abs(diffByCurrentLines!)) + 'px'
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop + (lineHeight * Math.abs(diffByCurrentLines!))

      this.lastLinesCount = lines
    }
    else if (lines == 1 && area.clientHeight == 60 || lines == 2 && area.clientHeight == 86 || lines == 3 && area.clientHeight == 112) {
      area.style.height = (area.clientHeight - lineHeight) + 'px';
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight + lineHeight + 'px'

      ///////////////////
      console.log(this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight)
      console.log(this.scrollContainer.nativeElement.scrollHeight)
      
      if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - lineHeight
      }
      ///////////////////

      this.lastLinesCount = lines
    }
    // ----------------------------------------------------

    console.log(lines)
    console.log(area.clientHeight)

    if (lines < 3 && area.clientHeight == 112) {

      area.style.height = (lineHeight * lines) + difBtwHeightAndLine + 'px';
      const element = this.scrollContainer.nativeElement
      element.style.height = this.scrollContainer.nativeElement.clientHeight + (lineHeight * (Math.abs(diffByCurrentLines!) - 1)) + 'px'

      if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
        // this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - (lineHeight * Math.abs(diffByCurrentLines!))
        console.log('change scroll position')
      }

      console.log('test 112')
      this.lastLinesCount = lines
    }

    // if (area.scrollHeight + difBtwHeightAndLine >= area.clientHeight + lineHeight && lines <= 4) {
    //   area.style.height = (area.clientHeight + (lineHeight * Math.abs(Math.abs(diffByCurrentLines) - 1))) + 'px'; // Rozszerz o jedną linię
    //   const element = this.scrollContainer.nativeElement
    //   element.style.height = this.scrollContainer.nativeElement.clientHeight - lineHeight + 'px'
    //   this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop + lineHeight
    //   // console.log('add')
    //   this.lastLinesCount = lines + 1
    // }
    // else if (lines == 1 && area.clientHeight == 60 || lines == 2 && area.clientHeight == 86 || lines == 3 && area.clientHeight == 112) {
    //   area.style.height = (area.clientHeight - lineHeight) + 'px';
    //   const element = this.scrollContainer.nativeElement
    //   element.style.height = this.scrollContainer.nativeElement.clientHeight + lineHeight + 'px'

    //   ///////////////////
    //   console.log(this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight)
    //   console.log(this.scrollContainer.nativeElement.scrollHeight)
    //   // console.log(this.scrollContainer.nativeElement.clientHeight)
      
    //   if (this.scrollContainer.nativeElement.scrollTop + this.scrollContainer.nativeElement.clientHeight != this.scrollContainer.nativeElement.scrollHeight) {
    //     this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollTop - lineHeight 
    //     console.log('change scroll position')
    //   }
    //   ///////////////////
    // }
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

    area.style.height = 34 + 'px';
    this.lastLinesCount = 1
  }

}
