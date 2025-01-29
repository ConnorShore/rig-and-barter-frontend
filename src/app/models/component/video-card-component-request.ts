import { IComponentRequest } from "./component-request";


export interface IVideocardComponentRequest extends IComponentRequest {
    length: number;
    slots: number;
    numHDMIs: number;
    numDisplayPorts: number;
    boostClock: number;
    vram: number;
}