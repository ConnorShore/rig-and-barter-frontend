import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { IMemoryComponentRequest } from "src/app/models/component/memory-component-request";

@Component({
    selector: 'rb-memory-component',
    standalone: true,
    templateUrl: './memory-component.component.html',
    styleUrl: './memory-component.component.scss',
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
export class MemoryComponentComponent {

    createMemoryComponentForm = new FormGroup({
        type: new FormControl(),
        size: new FormControl(),
        clockSpeed: new FormControl(),
        numSticks: new FormControl(),
    });

    getCurrentMemoryComponentValues() {
        const memoryComponentRequest: IMemoryComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.MEMORY,
            type: this.createMemoryComponentForm.value.type as string,
            size: this.createMemoryComponentForm.value.size as number,
            clockSpeed: this.createMemoryComponentForm.value.clockSpeed as number,
            numSticks: this.createMemoryComponentForm.value.numSticks as number
        };

        return memoryComponentRequest;
    }
}