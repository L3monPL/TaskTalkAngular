import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
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
export class ChatRoomCompanyComponent implements OnInit, AfterViewInit{

  constructor( 
    public websocketService: WebsocketService,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    public userDataService: UserDataService,
  ) { }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngAfterViewInit() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

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
      // this.subConnectToRoom?.unsubscribe()
      this.messages = new Array()
      this.page = 0
      this.isDuplicateMessage = false
      // this.connectToRoom() // in the end of this.joinTopicMessage()
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

        let scrollPosition = this.scrollContainer.nativeElement.scrollTop

        this.messages!.unshift(mappingMessage)
        setTimeout(() => {
          if (!this.isSendMessageByMe) {
            this.scrollContainer.nativeElement.scrollTop = scrollPosition
          }
          if (this.isSendMessageByMe) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
            this.isSendMessageByMe = false
          }
        });
      })

      //get all messages by current user
      this.subTopicRoomUser = this.websocketService.stompClient.subscribe(`/user/topic/room/${this.idParam}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body)

        console.log(this.loadingNextPage)
        
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
        pullMessageArray!.reverse()

        //sprawdzam duplikaty - to edit
        // for (let index = 0; index < pullMessageArray!.length; index++) {

        //   console.log(this.messages.indexOf(messageArray[index]))
        //   console.log(pullMessageArray[index])

        //   if (messageArray[index]?.id == pullMessageArray[index]?.id) {
        //     this.isDuplicateMessage = true 
        //     return
        //   }
        // }

        const idsArray1 = this.messages.map(obj => obj.id);
        const idsArray2 = pullMessageArray.map(obj => obj.id);

        for (const id of idsArray1) {
          if (idsArray2.includes(id)) {
            this.isDuplicateMessage = true 
            return
          }
        }
        

        // for (let index = 0; index < pullMessageArray!.length; index++) {

        //   console.log(this.messages.indexOf(messageArray[index]))
        //   console.log(pullMessageArray[index])

        //   if (messageArray[index]?.id == pullMessageArray[index]?.id) {
        //     this.isDuplicateMessage = true 
        //     return
        //   }
        // }

        console.log(messageContent)
        //sprawdzam czy zwrociło mi nowe wiadomości, jeśli tak to pozwalam na pobieranie kolejnej strony
        if (messageContent && !this.isDuplicateMessage) {
          this.canLoadNextPage = true
        }


        const previousScrollPosition = this.scrollContainer?.nativeElement.scrollTop;
        // this.previousContentHeight = this.scrollContainer?.nativeElement.scrollHeight;
        this.previousHeight = this.scrollContainer?.nativeElement.scrollHeight;
        // console.log(this.previousHeight)
        console.log("scrollTop1: " + this.scrollContainer!.nativeElement.scrollTop)

        if (!this.isDuplicateMessage) {
          // pullMessageArray!.reverse()
          this.messages.push(...pullMessageArray)
          // this.messages = [...pullMessageArray, ...messageArray]
        }
        console.log("scrollTop: " + this.scrollContainer!.nativeElement.scrollTop)

        let scrollTop = this.scrollContainer!.nativeElement.scrollTop

        this.TODELETE_COUNT = this.TODELETE_COUNT + 1

        // Przewiń kontener do nowej pozycji
        setTimeout(() => {

          this.scrollContainer!.nativeElement.scrollTop = scrollTop
          // const heightDifference = newHeight - previousHeight + previousScrollPosition;

          // this.scrollContainer!.nativeElement.scrollTop = heightDifference;
          console.log(this.scrollContainer!.nativeElement.scrollTop)
          this.beforeLoadNextPageScrollTop = this.scrollContainer!.nativeElement.scrollTop
          this.loadingNextPage = false
          console.log('countFunc: ' + this.TODELETE_COUNT)
        }, 500);
        // this.loadingNextPage = false
      })
      this.connectToRoom()
  }

  TODELETE_COUNT = 0

  beforeLoadNextPageScrollTop?: number
  previousHeight?: number
  isConnectedToRoom = false

  connectToRoom(){
    if (this.isConnectedToRoom) {
      return
    }
    this.websocketService.stompClient.send(`/app/ws/room/${this.idParam}/message`, {}, JSON.stringify(0))
    this.isConnectedToRoom = true
    console.log(`connect to room ${this.idParam}`)
  }

  isSendMessageByMe = false

  sendMessage(){
    if (!this.inputMessage) {
      return
    }

    let messageResponse = {
      message: this.inputMessage
    }
    this.isSendMessageByMe = true
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
  loadingNextPage: boolean = false


  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    // Pobierz element, na którym wywołano zdarzenie scroll
    const element = this.scrollContainer.nativeElement

    if (element) {
      // Sprawdź wartość scrollTop dla tego elementu
      let scrollTop = element.scrollTop;
      // console.log("scrollTop: " + scrollTop)
      // console.log("element.scrollHeight: " + element.scrollHeight)
      // console.log("this.previousHeight: " + this.previousHeight)
      let suma = element.scrollHeight + scrollTop - this.previousHeight! - this.beforeLoadNextPageScrollTop! - 1
      // console.log("suma: " + (element.scrollHeight + scrollTop - this.previousHeight! - this.beforeLoadNextPageScrollTop!))


      const itemHeight = this.scrollContainer.nativeElement.offsetHeight
      const scrollContainer = this.scrollContainer.nativeElement.scrollHeight
      const scrollTopTest = -event.target.scrollTop;
      // console.log(scrollTopTest)
      // console.log(itemHeight)
      // console.log(scrollContainer)

      let suma2 = scrollContainer - itemHeight
      // console.log(suma2)

      // const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;

  // console.log(scrollTop + clientHeight)
  // console.log(itemHeight)
  // console.log(scrollHeight)

  

  // Sprawdź czy użytkownik przewinął stronę na górę
  // if (scrollTop + clientHeight >= scrollHeight && !this.loadingNextPage) {
  //   // Tutaj możesz wykonać jakieś działanie, np. załadować kolejne wiadomości
  //   this.loadingNextPage = true
  //   this.loadMoreMessages()
  // }

      // if ((suma2 - scrollTopTest) == 0 && (this.page % 2 !== 0)) {
      //   console.log(this.page)
      //   console.log("załaduj")

      //   setTimeout(() => {
      //     // Tutaj możesz wykonać jakieś działanie
      //     if (!this.canLoadNextPage) {
      //       return
      //     }
      //     this.loadMoreMessages()
      //     return
      //   });
      // }
      // if ((this.page % 2 === 0) && (suma2 - scrollTopTest) == 1) {
      //   console.log(this.page)
      //   console.log("załaduj")

      //   // setTimeout(() => {
      //     // Tutaj możesz wykonać jakieś działanie
      //     // if (!this.canLoadNextPage) {
      //     //   return
      //     // }
      //     this.loadMoreMessages()
      //     // return
      //   // });
      // } 
      

      // Jeśli scrollTop jest mniejszy niż 200, wykonaj jakąś akcję
      // console.log("scrollTopOnScroll: " + this.scrollContainer!.nativeElement.scrollTop)
      // console.log(suma)
      // console.log(this.loadingNextPage)
      if (this.loadingNextPage) {
        console.log("this.loadingNextPage: " + this.loadingNextPage)
        return
      }
      if (suma <= 1 && !this.loadingNextPage) {
        // setTimeout(() => {
          // Tutaj możesz wykonać jakieś działanie
          if (!this.canLoadNextPage) {
            return
          }
          // if (this.loadingNextPage) {
          //   console.log("this.loadingNextPage: " + this.loadingNextPage)
          //   return
          // }
          this.loadingNextPage = true
          console.log("scrollTopOnScroll: " + this.scrollContainer!.nativeElement.scrollTop)
          this.loadMoreMessages()
          console.log('Scroll top is less than 300');
        // });
      } 
    }
  }

}
