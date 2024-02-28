import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private _config: any;
    get config(): any {
        return this._config;
    }

    constructor(private httpClient: HttpClient) { }

    async loadConfigurationFile() {
        let configObserve = this.httpClient.get('/assets/config.json');
        this._config = await lastValueFrom(configObserve);
    }
    
    get apiGatewayUrl(): string {
        return this._config['api-gateway-url'];
    }
}