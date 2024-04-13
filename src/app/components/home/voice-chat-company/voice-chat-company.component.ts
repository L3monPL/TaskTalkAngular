import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-voice-chat-company',
  standalone: true,
  imports: [],
  templateUrl: './voice-chat-company.component.html',
  styleUrl: './voice-chat-company.component.scss'
})
export class VoiceChatCompanyComponent implements OnInit, OnDestroy {

  constructor( 
    public websocketService: WebsocketService,
    private route: ActivatedRoute,
    // private companyManagementService: CompanyManagementService,
    // public userDataService: UserDataService
  ) { }

  ngOnDestroy(): void {
    //unsubscribe when change company
    this.subRouteParam?.unsubscribe() 
    this.unsubscribeList()
  }

  ngOnInit(): void {
    this.checkUrl()
  }

  idParam?: number
  subRouteParam?: Subscription

  checkUrl() {
    this.subRouteParam = this.route.paramMap.subscribe(params => {
      this.idParam = Number(params.get('id')!)
      console.log(this.idParam)
      this.idParam = 6 // to delete

      this.unsubscribeList()
      this.subscribeRoom() 
    });
  }

  unsubscribeList(){
    this.subTopicRoom?.unsubscribe()
  }

  joinVoiceChat(id: number){
    console.log('join voice chat Id: ' + id)
    this.websocketService.stompClient.send(`/app/ws/voiceChat/${this.idParam}/join`, {})

  }

  subTopicRoom?: Subscription

  subscribeRoom(){
    this.subTopicRoom = this.websocketService.stompClient.subscribe(`/topic/voiceChat/${this.idParam}`, (messages: any) => {
      const messageContent: any = JSON.parse(messages.body)
      console.log(messageContent)
    })
  }
}
