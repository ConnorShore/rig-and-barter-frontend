import { IComponent } from "./component";

export interface IHardDriveComponent extends IComponent{
    size: number;
    rpm: number;
    cacheSize: number;
}