import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IMessageGroupResponse } from "../models/message/message-group-response";
import { IMessageRequest } from "../models/message/message-request";
import { environment } from "src/environments/environment";


@Injectable()
export class MessageService {

    constructor(private httpClient: HttpClient) {}

    createMessage(message: IMessageRequest): Observable<IMessageRequest> {
        return this.httpClient.post<IMessageRequest>(`${environment.apiGateway}/api/message`, message);
    }

    getAllMessageGroupsForUser(): Observable<IMessageGroupResponse[]> {
        return this.httpClient.get<IMessageGroupResponse[]>(`${environment.apiGateway}/api/message/group`);
    }

    getMessageGroupForUser(groupId: string): Observable<IMessageGroupResponse> {
        return this.httpClient.get<IMessageGroupResponse>(`${environment.apiGateway}/api/message/group/${groupId}`);
    }
}
    