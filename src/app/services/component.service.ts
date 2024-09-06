import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { IComponent } from "../models/pc-builder/component";
import { ComponentCategory } from "../models/component-category";


@Injectable({
    providedIn: 'root'
})
export class ComponentService {
    
    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    getAllComponents(): Observable<IComponent[]>{
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/component`);
        return this.httpClient.get<IComponent[]>(url);
    }

    getComponentsOfCategory(category: ComponentCategory): Observable<IComponent[]> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/component/${ComponentCategory[category]}`);
        return this.httpClient.get<IComponent[]>(url);
    }
}