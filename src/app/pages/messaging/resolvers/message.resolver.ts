import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { IMessageGroupResponse } from "src/app/models/message/message-group-response";
import { MessageService } from "src/app/services/message.service";

export const messageGroupResolver: ResolveFn<IMessageGroupResponse[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    messageService: MessageService = inject(MessageService)
) => {
    return messageService.getAllMessageGroupsForUser();
}