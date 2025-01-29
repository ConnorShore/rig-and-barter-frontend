import { IComponentRequest } from "./component-request";

export interface IPowerSupplyComponentRequest extends IComponentRequest {
    connector: string;
    watts: number;
    num8PinPCIE: number;
    num6PinPCIE: number;
}