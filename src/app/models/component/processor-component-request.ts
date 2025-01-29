import { IComponentRequest } from "./component-request";

export interface IProcessorComponentRequest extends IComponentRequest {
    baseClock: number;
    turboClock: number;
    cores: number;
    threads: number;
}