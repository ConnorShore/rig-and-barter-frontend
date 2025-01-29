import { IComponentRequest } from "./component-request";

export interface ISolidStateDriveComponentRequest extends IComponentRequest {
    formFactor: string;
    protocol: string;
    size: number;
}