import { IMessageResponse } from "./message-response";

export interface IMessageGroupResponse {
    id: string;
    buyerId: string;
    sellerId: string;
    messages: IMessageResponse[];
}