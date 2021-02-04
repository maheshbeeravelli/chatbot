import { ChatService } from './../chat.service';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { fadeIn, fadeInOut } from '../animations'

const randomMessages = [
  'Nice to meet you',
  'We now support Angular 10!',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  'Is there anything else I can help you with?',
  'That\'s awesome',
  'Angular 10 Elements is the bomb 💣 ',
  'Can you explain in more detail?',
  'Anyway I\'ve gotta go now',
  'It was a pleasure to chat with you',
  'We are happy to make you a custom offer!',
  'Bye',
  ':)',
]

const rand = max => Math.floor(Math.random() * max)

const getRandomMessage = () => randomMessages[rand(randomMessages.length)]

@Component({
  selector: 'chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  animations: [fadeInOut, fadeIn],
})
export class ChatWidgetComponent implements OnInit {
  @ViewChild('bottom') bottom: ElementRef
  @Input() public theme: 'blue' | 'grey' | 'red' = 'blue'
  @Input() public url: string

  public _visible = false

  public get visible() {
    return this._visible
  }

  @Input() public set visible(visible) {
    this._visible = visible
    if (this._visible) {
      setTimeout(() => {
        this.scrollToBottom()
        this.focusMessage()
      }, 0)
    }
  }
  constructor(private chatService: ChatService) {}
  public focus = new Subject()

  public operator = {
    name: 'Operator',
    status: 'online',
    avatar:'https://randomuser.me/api/portraits/lego/0.jpg'
    // avatar: `https://cdn.dribbble.com/users/275794/screenshots/3128598/gbot_800.png`,
  }

  public client = {
    name: 'Guest User',
    user: 'test_user',
    status: 'online',
    // avatar: `https://randomuser.me/api/portraits/men/${rand(100)}.jpg`,
    avatar: `https://storage.proboards.com/6172192/images/gKhXFw_5W0SD4nwuMev1.png`,
  }

  public messages = []

  public addMessage(from, text, type: 'received' | 'sent') {
    this.messages.unshift({
      from,
      text,
      type,
      date: new Date().getTime(),
    })
    this.scrollToBottom()
  }

  public scrollToBottom() {
    if (this.bottom !== undefined) {
      this.bottom.nativeElement.scrollIntoView()
    }
  }

  public focusMessage() {
    this.focus.next(true)
  }

  public randomMessage() {
    this.addMessage(this.operator, getRandomMessage(), 'received')
  }

  ngOnInit() {
    setTimeout(() => (this.visible = true), 1000)
    setTimeout(() => {
      this.addMessage(this.operator, 'Hi, how can we help you?', 'received')
    }, 1500)
  }

  public toggleChat() {
    this.visible = !this.visible
  }

  public sendMessage({ message }) {
    if (message.trim() === '') {
      return
    }
    if (this.url) {
      this.addMessage(this.client, message, 'sent')
      this.chatService
        .sendMessage(this.url, { sender: this.client.user, message })
        .subscribe((resp) => {
          if (resp) {
            resp.forEach((message) => {
              this.addMessage(this.operator, message.text, 'received')
            })
          }
        })
    } else {
      this.addMessage(this.client, message, 'sent')
      setTimeout(() => this.randomMessage(), 1000)
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '/') {
      this.focusMessage()
    }
    if (event.key === '?' && !this._visible) {
      this.toggleChat()
    }
  }
}
