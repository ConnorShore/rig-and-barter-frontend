import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IMessageGroupResponse } from "src/app/models/message/message-group-response";
import { MessageService } from "src/app/services/message.service";


export const messageGroupResolver: ResolveFn<IMessageGroupResponse> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    messageService: MessageService = inject(MessageService)
) => {
    const id = route.paramMap.get('groupId') as string;
    console.log('got id for message group: ', id);
    return messageService.getMessageGroupForUser(id);
}