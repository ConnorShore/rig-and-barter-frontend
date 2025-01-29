import { IComponentRequest } from "./component-request";

export interface IMotherBoardComponentRequest extends IComponentRequest {
    connector: string;
    socket: string;
    memoryType: string;
    memoryCapacity: number;
    memorySlots: number;
}