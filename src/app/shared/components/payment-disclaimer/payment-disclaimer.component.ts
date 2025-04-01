import { Component, Input } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
    selector: 'rb-payment-disclaimer',
    standalone: true,
    templateUrl: './payment-disclaimer.component.html',
    styleUrls: ['./payment-disclaimer.component.scss'],
})
export class PaymentDisclaimerComponent {

    @Input() showCardHelp: boolean = false;

    isProduction: boolean = environment.production;

    constructor() { }
}