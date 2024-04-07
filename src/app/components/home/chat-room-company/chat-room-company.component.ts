import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
export class ChatRoomCompanyComponent implements OnInit{

  constructor( 
    public websocketService: WebsocketService,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    public userDataService: UserDataService
  ) { }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.checkUrl()
  }

  idParam?: number

  checkUrl() {
    this.route.paramMap.subscribe(params => {
      this.idParam = Number(params.get('id')!)
      console.log(this.idParam)

      this.subTopicRoom?.unsubscribe()
      this.subTopicRoomUser?.unsubscribe()
      this.messages = new Array()
      this.page = 0
      this.isDuplicateMessage = false
      // this.connectToRoom()
      this.joinTopicMessage()
    });
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
        setTimeout(() => {
          this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
        }, 0);
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

  sendMessage(){
    if (!this.inputMessage) {
      return
    }

    let messageResponse = {
      message: this.inputMessage
    }
    this.websocketService.stompClient.send(`/app/ws/room/${this.idParam}/sendMessage`, {}, JSON.stringify(messageResponse))
    this.inputMessage = ''
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
      return true
    } else {
      return false
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
      return true
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
        console.log('Scroll top is less than 300');
      } 
    }
  }

}
