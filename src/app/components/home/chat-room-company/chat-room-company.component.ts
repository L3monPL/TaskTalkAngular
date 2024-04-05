import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

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
    private route: ActivatedRoute
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
      this.connectToRoom()
      this.joinTopicMessage()
    });
  }

  inputMessage?: string

  messages: Array<any> = []

  subTopicRoom?: Subscription
  subTopicRoomUser?: Subscription

  joinTopicMessage(){

    // this.websocketService.stompClient.connect({}, ()=>{
      this.subTopicRoom = this.websocketService.stompClient.subscribe(`/topic/room/${this.idParam}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body)
        // console.log(messageContent)
        this.messages!.push(messageContent)
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

        messageContent.forEach((element: any) => {
          pullMessageArray.push(element)
        });

        let isDuplicate = false

        //sprawdzam duplikaty - to edit
        for (let i = 0; i < 10; i++) {
          let obiekt = pullMessageArray[i];
          // Sprawdzamy, czy obiekt z tablicy1 występuje w tablicy2
          if (messageArray.includes(obiekt)) {
            console.log('DUPLIKAT!')
            isDuplicate = true 
            return
          }
        }

        console.log(isDuplicate)

        if (!isDuplicate) {
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
