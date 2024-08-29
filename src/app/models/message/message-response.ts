
export interface IMessageResponse {
    id: string;
    groupName: string;
    groupId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
}