import { ICaseComponent } from "./case-component";
import { IHardDriveComponent } from "./hard-drive-component";
import { IMemoryComponent } from "./memory-component";
import { IMotherboardComponent } from "./motherboard-component";
import { IPowerSupplyComponent } from "./power-supply-component";
import { IProcessorComponent } from "./processor-component";
import { ISolidStateDriveComponent } from "./solid-state-drive-component";
import { IVideoCardComponent } from "./video-card-component";

export interface IPCBuild {
    id?: string;
    name?: string;
    caseComponent?: ICaseComponent;
    motherboardComponent?: IMotherboardComponent;
    powerSupplyComponent?: IPowerSupplyComponent;
    cpuComponent?: IProcessorComponent;
    gpuComponent?: IVideoCardComponent;
    memoryComponents?: IMemoryComponent[];
    hardDriveComponents?: IHardDriveComponent[];
    solidStateDriveComponents?: ISolidStateDriveComponent[];
}