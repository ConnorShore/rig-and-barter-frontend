import { IComponent } from "./component";

export interface ICaseComponent extends IComponent{
    color: string;
    windowed: boolean;
    motherboardType: string;
    powerSupplyType: string;
    gpuLength: number;
}