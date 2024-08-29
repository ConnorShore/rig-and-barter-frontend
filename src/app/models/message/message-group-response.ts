import { IMessageResponse } from "./message-response";

export interface IMessageGroupResponse {
    id: string;
    buyerId: string;
    sellerId: string;
    groupName: string;
    groupImageUrl: string;
    messages: IMessageResponse[];
}