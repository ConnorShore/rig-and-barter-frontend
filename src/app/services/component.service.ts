import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IComponent } from "../models/pc-builder/component";
import { ComponentCategory } from "../models/component-category";
import { IPagedComponent } from "../models/pc-builder/paged-component";
import { environment } from "src/environments/environment";
import { IComponentRequest } from "../models/component/component-request";


@Injectable({
    providedIn: 'root'
})
export class ComponentService {
    
    constructor(private httpClient: HttpClient) { }

    createComponent(component: IComponentRequest, image: File): Observable<IComponent> {
        const formData:any = new FormData();
        formData.append('component', new Blob([JSON.stringify(component)]), {type: 'application/json'});
        formData.append('image', image, image.name);
        console.log('component form data: ', formData);
        return this.httpClient.post<IComponent>(`${environment.apiGateway}/api/component`, formData);
    }

    getAllComponents(): Observable<IComponent[]>{
        let url = `${environment.apiGateway}/api/component`;
        return this.httpClient.get<IComponent[]>(url);
    }

    getComponentsOfCategory(category: ComponentCategory): Observable<IComponent[]> {
        let categoryName = ComponentCategory[category];
        console.log('categoryName: ', categoryName);
        let url = `${environment.apiGateway}/api/component/${categoryName}`;
        console.log('url: ', url);
        return this.httpClient.get<IComponent[]>(url);
    }

    getPagedComponentsOfCategory(category: ComponentCategory, page: number, numPerPage: number, sortColumn: string, descending: boolean, textSeach: string): Observable<IPagedComponent> {
        let categoryName = ComponentCategory[category];
        let url = `${environment.apiGateway}/api/component/${categoryName}/paged`;
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