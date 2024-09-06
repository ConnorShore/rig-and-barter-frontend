export interface IPCBuild {
    id: string;
    name: string;
    caseId: string;
    motherBoardId: string;
    powerSupplyId: string;
    cpuId: string;
    gpuId: string;
    memoryIds: string[];
    hardDriveIds: string[];
    solidStateDriveIds: string[];
}