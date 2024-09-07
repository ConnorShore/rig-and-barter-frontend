import { IComponent } from "./component";

export interface ISolidStateDriveComponent extends IComponent{
    formFactor: string;
    protocol: string;
    size: number;
}