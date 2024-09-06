import { IComponent } from "./component";

export interface IPowerSupplyComponent extends IComponent{
    connector: string;
    watts: number;
    num8PinPCIE: number;
    num6PinPCIE: number;
}