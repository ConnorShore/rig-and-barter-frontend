import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { IProcessorComponentRequest } from "src/app/models/component/processor-component-request";


@Component({
    selector: 'rb-cpu-component',
    standalone: true,
    templateUrl: './cpu-component.component.html',
    styleUrl: './cpu-component.component.scss',
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
export class CPUComponentComponent {
    
    createCpuComponentForm = new FormGroup({
        baseClock: new FormControl(),
        turboClock: new FormControl(),
        cores: new FormControl(),
        threads: new FormControl(),
    });

    getCurrentProcessorComponentValues() {
        const processorComponentRequest: IProcessorComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.CPU,
            baseClock: this.createCpuComponentForm.value.baseClock as number,
            turboClock: this.createCpuComponentForm.value.turboClock as number,
            cores: this.createCpuComponentForm.value.cores as number,
            threads: this.createCpuComponentForm.value.threads as number
        };

        return processorComponentRequest;
    }
}