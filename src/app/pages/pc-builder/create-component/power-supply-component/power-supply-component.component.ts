import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { IPowerSupplyComponentRequest } from "src/app/models/component/power-supply-component-request";

@Component({
    selector: 'rb-power-supply-component',
    standalone: true,
    templateUrl: './power-supply-component.component.html',
    styleUrl: './power-supply-component.component.scss',
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule
    ]
})
export class PowerSupplyComponentComponent {
    createPowerSupplyComponentForm = new FormGroup({
        connector: new FormControl(),
        watts: new FormControl(),
        num8PinPCIE: new FormControl(),
        num6PinPCIE: new FormControl(),
    });

    getCurrentPowerSupplyComponentValues() {
        const powerSupplyComponentRequest: IPowerSupplyComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.POWER_SUPPLY,
            connector: this.createPowerSupplyComponentForm.value.connector as string,
            watts: this.createPowerSupplyComponentForm.value.watts as number,
            num8PinPCIE: this.createPowerSupplyComponentForm.value.num8PinPCIE as number,
            num6PinPCIE: this.createPowerSupplyComponentForm.value.num6PinPCIE as number
        };

        return powerSupplyComponentRequest;
    }
}