import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of,  } from 'rxjs'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}
  sendMessage(url, message: { sender: string; message: string }) {
    
    return this.http.post(url, message).pipe(catchError(()=>{
        return of([
          {
            receipt_id: 'test_user',
            text: 'We are facing some technical issues.',
          },
          {
            receipt_id: 'test_user',
            text: 'Sorry for the inconvenience. Please try after sometime.',
          }
        ])
    })) as Observable<{
      receipt_id: string
      text: string
    }[]>
  }
}
