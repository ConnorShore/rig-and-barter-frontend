import { IComponentRequest } from "./component-request";

export interface ICaseComponentRequest extends IComponentRequest {
    color: string;
    windowed: boolean;
    motherboardType: string;
    powerSupplyType: string;
    gpuLength: number;
}