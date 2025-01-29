import { IComponentRequest } from "./component-request";


export interface IHardDriveComponentRequest extends IComponentRequest {
    size: number;
    rpm: number;
    cacheSize: number;
}