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
        console.log('loading config file...');
        let configObserve = this.httpClient.get('/config/config.json');
        console.log('configObserve: ', configObserve);
        this._config = await lastValueFrom(configObserve);
        console.log('config loaded: ', this._config);
    }
    
    get apiGatewayUrl(): string {
        return this._config['api-gateway-url'];
    }
}