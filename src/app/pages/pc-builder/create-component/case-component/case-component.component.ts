import { Component, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { ICaseComponentRequest } from "src/app/models/component/case-component-request";


@Component({
    selector: 'rb-case-component',
    standalone: true,
    templateUrl: './case-component.component.html',
    styleUrl: './case-component.component.scss',
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
export class CaseComponentComponent {

    createCaseComponentForm = new FormGroup({
        color: new FormControl(''),
        windowed: new FormControl(false),
        motherboardType: new FormControl(''),  // TODO: Move to a dropdown option
        powerSupplyType: new FormControl(''),  // TODO: Move to a dropdown option
        gpuLength: new FormControl(0),
    });

    getCurrentCaseComponentValues() {
        const caseComponentRequest: ICaseComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.CASE,
            color: this.createCaseComponentForm.value.color as string,
            windowed: this.createCaseComponentForm.value.windowed as boolean,
            motherboardType: this.createCaseComponentForm.value.motherboardType as string,
            powerSupplyType: this.createCaseComponentForm.value.powerSupplyType as string,
            gpuLength: this.createCaseComponentForm.value.gpuLength as number
        };

        return caseComponentRequest;
    }
}