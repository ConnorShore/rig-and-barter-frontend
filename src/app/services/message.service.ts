import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "./configuration.service";
import { Observable } from "rxjs";
import { IMessageGroupResponse } from "../models/message/message-group-response";
import { createBackendRequest } from "../shared/http.utils";
import { IMessageRequest } from "../models/message/message-request";


@Injectable()
export class MessageService {

    constructor(private httpClient: HttpClient, private configService: ConfigurationService) {}

    createMessage(message: IMessageRequest): Observable<IMessageRequest> {
        return this.httpClient.post<IMessageRequest>(createBackendRequest(this.configService.apiGatewayUrl, 'api/message'), message);
    }

    getAllMessageGroupsForUser(): Observable<IMessageGroupResponse[]> {
        return this.httpClient.get<IMessageGroupResponse[]>(createBackendRequest(this.configService.apiGatewayUrl, 'api/message/group'));
    }

    getMessageGroupForUser(groupId: string): Observable<IMessageGroupResponse> {
        return this.httpClient.get<IMessageGroupResponse>(createBackendRequest(this.configService.apiGatewayUrl, `api/message/group/${groupId}`));
    }
}
    