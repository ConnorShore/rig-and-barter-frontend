import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "./configuration.service";
import { IPCBuildRequest } from "../models/pc-builder/pc-build-request";
import { createBackendRequest } from "../shared/http.utils";
import { Observable } from "rxjs";
import { IPCBuild } from "../models/pc-builder/pc-build";


@Injectable({
    providedIn: 'root'
})
export class PCBuilderService {
    
    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    savePCBuild(build: IPCBuildRequest): Observable<IPCBuild>{
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/pc-builder`);
        return this.httpClient.post<IPCBuild>(url, build);
    }

    getPCBuilds(): Observable<IPCBuild[]> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/pc-builder`);
        return this.httpClient.get<IPCBuild[]>(url);
    }

    deletePCBuild(buildId: string): Observable<void> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/pc-builder/${buildId}`);
        return this.httpClient.delete<void>(url);
    }
}