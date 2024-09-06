import { IComponent } from "./component";

export interface IProcessorComponent extends IComponent{
    baseClock: number;
    turboClock: number;
    cores: number;
    threads: number;
}