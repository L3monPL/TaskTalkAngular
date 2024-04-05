import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyManagementService } from '../../../services/global/company-management.service';

export interface ChatRoomMessage{
  id: number
  roomId: number
  userId: number|string
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
    private companyManagementService: CompanyManagementService
  ) { }

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
      this.connectToRoom()
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
          userId: this.companyManagementService.companyUserList?.find(user => user.id == messageContent.userId)!.username!,
          message: messageContent.message,
          fileId: messageContent.fileId,
          replyToId: messageContent.replyToId,
          edited: messageContent.edited,
          createdAt: messageContent.createdAt

        }
        this.messages!.push(mappingMessage)
      })

      //get all messages by current user
      this.subTopicRoomUser = this.websocketService.stompClient.subscribe(`/user/topic/room/${this.idParam}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body)

        console.log("pobrane wiadomosci")
        console.log(messageContent)
        console.log("istniejace wiadomosci")
        console.log(this.messages)

        let pullMessageArray = new Array()

        let messageArray = this.messages

        messageContent.forEach((element: ChatRoomMessage) => {
          let mappingMessage = {
            id: element.id,
            roomId: element.roomId,
            userId: this.companyManagementService.companyUserList?.find(user => user.id == element.userId)!.username!,
            message: element.message,
            fileId: element.fileId,
            replyToId: element.replyToId,
            edited: element.edited,
            createdAt: element.createdAt
  
          }
          pullMessageArray.push(mappingMessage)
        });

        //sprawdzam duplikaty - to edit
        // for (let i = 0; i < 10; i++) {
        //   let obiekt = pullMessageArray[i];
        //   // Sprawdzamy, czy obiekt z tablicy1 występuje w tablicy2
        //   if (messageArray.includes(obiekt)) {
        //     console.log('DUPLIKAT!')
        //     isDuplicate = true 
        //     return
        //   }
        // }

        for (let index = 0; index < pullMessageArray!.length; index++) {
          if (messageArray[index]?.id == pullMessageArray[index]?.id) {
            // console.log('DUPLIKAT!')
            this.isDuplicateMessage = true 
            return
          }
        }

        console.log(this.isDuplicateMessage)

        if (!this.isDuplicateMessage) {
          this.messages = [...pullMessageArray, ...messageArray]
        }

        console.log("wszystkie wiadomosci")
        console.log(this.messages)

      })

    // })
    // this.connectToRoom()
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

  loadMoreMessages(){
    this.page = this.page + 1
    console.log(this.page)
    this.loadPageMessageToRoom(this.page)
  }

  loadPageMessageToRoom(page: number){
    this.websocketService.stompClient.send(`/app/ws/room/${this.idParam}/message`, {}, JSON.stringify(page))
  }



}
