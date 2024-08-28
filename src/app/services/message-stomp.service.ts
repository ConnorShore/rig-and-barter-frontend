import { Injectable } from "@angular/core";

import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';


@Injectable({
    providedIn: 'root'
})
export class MessageStompService {
    msocket = new SockJs('http://localhost:8080/msocket');
    messageStompClient = Stomp.over(this.msocket);

    sendMessage(topic: string, message: any): void {
        let finalTopic = `mapp/${topic}`;
        this.messageStompClient.send(finalTopic, {}, JSON.stringify(message));
        console.log('sent stom message to: ', finalTopic);
        console.log('with payloadL: ', message);
    }

    subscribe(topic: string, callback: any): void {
        const finalTopic = `/mtopic/${topic}`;
        const connected = this.messageStompClient.connected;
        if(connected) {
            this.subscribeToMessageTopic(finalTopic, callback);
            return;
        }
        
        this.messageStompClient.connect({}, () => {
            this.subscribeToMessageTopic(finalTopic, callback);
        });
    }

    private subscribeToMessageTopic(topic: string, callback: any): void {
        this.messageStompClient.subscribe(topic, (response: any) => {
            callback(response);
        });
    }
}