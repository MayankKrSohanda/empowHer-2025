import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
  messages:{sender:string, text:string}[]=[];
  userInput:string='';

  constructor(private http: HttpClient){}

  sendMessage(){
    if(this.userInput.trim()){
      this.messages.push({sender:'user',text:this.userInput});
  
      this.http.post<any>('http://localhost:8080/chat',{query: this.userInput}).subscribe({
        next:(request)=>{
          this.messages.push({sender:'bot',text: request.reply});
        }
      });
      this.userInput='';
    }
  }
}
