import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPCBuildRequest } from "../models/pc-builder/pc-build-request";
import { Observable } from "rxjs";
import { IPCBuild } from "../models/pc-builder/pc-build";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class PCBuilderService {
    
    constructor(private httpClient: HttpClient) { }

    savePCBuild(build: IPCBuildRequest): Observable<IPCBuild>{
        let url = `${environment.apiGateway}/api/pc-builder`;
        return this.httpClient.post<IPCBuild>(url, build);
    }

    getPCBuilds(): Observable<IPCBuild[]> {
        let url = `${environment.apiGateway}/api/pc-builder`;
        return this.httpClient.get<IPCBuild[]>(url);
    }

    deletePCBuild(buildId: string): Observable<void> {
        let url = `${environment.apiGateway}/api/pc-builder/${buildId}`;
        return this.httpClient.delete<void>(url);
    }
}