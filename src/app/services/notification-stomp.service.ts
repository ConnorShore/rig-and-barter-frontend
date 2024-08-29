import { Injectable } from "@angular/core";

import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { FrontEndNotificationType, IFrontEndNotification } from "../models/notification/front-end-notification";


@Injectable({
    providedIn: 'root'
})
export class NotificationStompService {
    socket = new SockJs('http://localhost:8080/socket');
    stompClient = Stomp.over(this.socket);

    sendMessage(topic: string, message: any): void {
        let finalTopic = `app/${topic}`;
        this.stompClient.send(finalTopic, {}, JSON.stringify(message));
        console.log('sent stom message to: ', finalTopic);
        console.log('with payloadL: ', message);
    }

    subscribe(callback: any): void {
        const connected = this.stompClient.connected;
        if(connected) {
            this.subscribeToNotificationTopic(callback);
            return;
        }
        
        this.stompClient.connect({}, () => {
            this.subscribeToNotificationTopic(callback);
        });
    }

    private subscribeToNotificationTopic(callback: any): void {
        console.log('subscribed to notification topic');
        let topic = '/topic/frontend';
        this.stompClient.subscribe(topic, (response: any) => {
            let notification: IFrontEndNotification = JSON.parse(response.body) as IFrontEndNotification;
            notification.notificationType = FrontEndNotificationType[notification.notificationType as unknown as keyof typeof FrontEndNotificationType]
            callback(notification);
        });
    }
}