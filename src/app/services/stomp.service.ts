import { Injectable } from "@angular/core";

import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';


@Injectable({
    providedIn: 'root'
})
export class StompService {
    // socket = new SockJs('http://localhost:8999/socket'); // works
    socket = new SockJs('http://localhost:8080/socket');
    stompClient = Stomp.over(this.socket);

    subscribe(topic: string, callback: any): void {
        const connected = this.stompClient.connected;
        console.log('websocket connected: ', connected);
        if(connected) {
            this.subscribeToTopic(topic, callback);
            return;
        }

        console.log('attempting to connect to websocket');
        this.stompClient.connect({}, () => {
            console.log('conencted to websocked');
            this.subscribeToTopic(topic, callback);
        });
    }

    private subscribeToTopic(topic: string, callback: any): void {
        console.log('subscribe to topic: ', topic);
        this.stompClient.subscribe(topic, () => {
            console.log('callback triggered');
            callback();
        });
    }
}