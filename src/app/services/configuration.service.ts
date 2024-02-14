import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";


@Injectable({providedIn: 'root'})
export class ConfigurationService {

    private _config: any;
    get config(): any {
        return this._config;
    }

    constructor(private httpClient: HttpClient) { }

    async loadConfigurationFile() {
        console.log('Preparing config load');
        let configObserve = this.httpClient.get('/assets/config.json');
        this._config = await lastValueFrom(configObserve);
        console.log('config file finished loading: ', this._config);
    }
    
    get apiGatewayUrl(): string {
        console.log('config file: ', this._config);
        return this._config['api-gateway-url'];
    }
}