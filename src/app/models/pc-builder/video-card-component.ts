import { IComponent } from "./component";

export interface IVideoCardComponent extends IComponent {
    length: number;
    slots: number;
    numHDMIs: number;
    numDisplayPorts: number;
    boostClock: number;
    vram: number;
}