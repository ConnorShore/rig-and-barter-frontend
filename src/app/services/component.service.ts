import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { IComponent } from "../models/pc-builder/component";
import { ComponentCategory } from "../models/component-category";
import { IPagedComponent } from "../models/pc-builder/paged-component";


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
        let categoryName = ComponentCategory[category];
        console.log('categoryName: ', categoryName);
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/component/${categoryName}`);
        console.log('url: ', url);
        return this.httpClient.get<IComponent[]>(url);
    }

    getPagedComponentsOfCategory(category: ComponentCategory, page: number, numPerPage: number, sortColumn: string, descending: boolean, textSeach: string): Observable<IPagedComponent> {
        let categoryName = ComponentCategory[category];
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/component/${categoryName}/paged`);
        return this.httpClient.get<IPagedComponent>(url, { 
            params: {
                page: page,
                numPerPage: numPerPage,
                sortColumn: sortColumn,
                descending: descending,
                searchTerm: textSeach
            }
        });
    }
}