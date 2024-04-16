import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent implements AfterViewInit{

  @Output() selectEmitter = new EventEmitter<string>();
  @Output() closeComponent = new EventEmitter<any>();

  isOpenConponent = false

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isOpenConponent = true
    })
  }

  emojiList = [
    {
      section: 1,
      name: 'Basic emoji',
      list: [
        {
          id: 1,
          emoji: '👍'
        },
        {
          id: 2,
          emoji: '❤️'
        },
        {
          id: 3,
          emoji: '💪'
        },
        {
          id: 4,
          emoji: '😎'
        },
        {
          id: 5,
          emoji: '😁'
        },
        {
          id: 6,
          emoji: '🖐'
        },
        {
          id: 7,
          emoji: '👋'
        },
        {
          id: 8,
          emoji: '👎'
        },
        {
          id: 9,
          emoji: '👌'
        },
        {
          id: 10,
          emoji: '😉'
        },
        {
          id: 11,
          emoji: '🙏'
        },
        {
          id: 12,
          emoji: '🏆'
        },
        {
          id: 13,
          emoji: '🥳'
        },
        {
          id: 14,
          emoji: '😝'
        },
        {
          id: 15,
          emoji: '😴'
        },
        {
          id: 16,
          emoji: '🍺'
        }
      ]
    },
    {
      section: 2,
      list: [
        {
          id: 1111,
          emoji: '✏️'
        }
      ]
    }
  ]

  emojiSelect(emoji: string){
    this.selectEmitter.emit(emoji)
  }

  @ViewChild('container') private container!: ElementRef

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    
    if (!this.container.nativeElement.contains(event.target) && this.isOpenConponent) {
      this.closeComponent.emit()
      // console.log('outside')
    }
  }
}
