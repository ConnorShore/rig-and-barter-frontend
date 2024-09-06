import { IComponent } from "./component";

export interface IMemoryComponent extends IComponent {
    type: string;
    size: number;
    clockSpeed: number;
    numSticks: number;
}