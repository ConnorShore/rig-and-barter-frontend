import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { IMotherBoardComponentRequest } from "src/app/models/component/motherboard-component-request";

@Component({
    selector: 'rb-motherboard-component',
    standalone: true,
    templateUrl: './motherboard-component.component.html',
    styleUrl: './motherboard-component.component.scss',
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
export class MotherboardComponentComponent {

    createMotherboardComponentForm = new FormGroup({
        connector: new FormControl(),
        socket: new FormControl(),
        memoryType: new FormControl(),
        memoryCapacity: new FormControl(),
        memorySlots: new FormControl()
    });

    getCurrentMotherboardComponentValues() {
        const motherboardComponentRequest: IMotherBoardComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.MOTHERBOARD,
            connector: this.createMotherboardComponentForm.value.connector as string,
            socket: this.createMotherboardComponentForm.value.socket as string,
            memoryType: this.createMotherboardComponentForm.value.memoryType as string,
            memoryCapacity: this.createMotherboardComponentForm.value.memoryCapacity as number,
            memorySlots: this.createMotherboardComponentForm.value.memorySlots as number
        };

        return motherboardComponentRequest;
    }
}