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

    getPCBuild(): Observable<IPCBuild> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/pc-builder`);
        return this.httpClient.get<IPCBuild>(url);
    }
}