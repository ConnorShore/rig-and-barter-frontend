import { MessageService } from "src/app/services/message.service";
import { MessageActiveComponent } from "./message-active/message-active.component";
import { MessagingComponent } from "./messaging.component";
import { Routes } from "@angular/router";
import { messageGroupsResolver } from "./resolvers/message.resolver";
import { MessageEmptyComponent } from "./message-empty/message-empty.component";
import { messageGroupResolver } from "./resolvers/message-group.resolver";


export const MESSAGING_ROUTES: Routes = [
    {
        path: '',
        component: MessagingComponent,
        providers: [
            MessageService
        ],
        resolve: {
            messageGroups: messageGroupsResolver
        },
        children: [
            {
              path: '',
              component: MessageEmptyComponent
            },
            {
              path: ':groupId',
              component: MessageActiveComponent,
              resolve: {
                messageGroup: messageGroupResolver
              }
            }
        ] 
    }
];
