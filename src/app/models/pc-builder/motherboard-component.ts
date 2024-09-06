import { IComponent } from "./component";

export interface IMotherboardComponent extends IComponent {
    connector: string;
    socket: string;
    memoryType: string;
    memoryCapacity: number;
    memorySlots: number;
}