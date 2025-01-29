import { IComponentRequest } from "./component-request";

export interface IMemoryComponentRequest extends IComponentRequest {
    type: string;
    size: number;
    clockSpeed: number;
    numSticks: number;
}