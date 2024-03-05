import { Injectable } from "@angular/core";

import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { FrontEndNotificationType, IFrontEndNotification } from "../model/notification/front-end-notification";


@Injectable({
    providedIn: 'root'
})
export class StompService {
    socket = new SockJs('http://localhost:8080/socket');
    stompClient = Stomp.over(this.socket);

    subscribe(topic: string, callback: any): void {
        const connected = this.stompClient.connected;
        if(connected) {
            this.subscribeToTopic(topic, callback);
            return;
        }
        
        this.stompClient.connect({}, () => {
            this.subscribeToTopic(topic, callback);
        });
    }

    private subscribeToTopic(topic: string, callback: any): void {
        this.stompClient.subscribe(topic, (response: any) => {
            let notification: IFrontEndNotification = JSON.parse(response.body) as IFrontEndNotification;
            notification.notificationType = FrontEndNotificationType[notification.notificationType as unknown as keyof typeof FrontEndNotificationType]
            callback(notification);
        });
    }
}