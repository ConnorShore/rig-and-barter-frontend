import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { ISolidStateDriveComponentRequest } from "src/app/models/component/solid-state-drive-component-request";

@Component({
    selector: 'rb-solid-state-drive-component',
    standalone: true,
    templateUrl: './solid-state-drive-component.component.html',
    styleUrl: './solid-state-drive-component.component.scss',
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
export class SolidStateDriveComponentComponent {

    createSSDComponentForm = new FormGroup({
        size: new FormControl(),
        formFactor: new FormControl(),
        protocol: new FormControl(),
    });

    getCurrentSSDComponentValues() {
        const ssdComponentRequest: ISolidStateDriveComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.SOLID_STATE_DRIVE,
            size: this.createSSDComponentForm.value.size as number,
            formFactor: this.createSSDComponentForm.value.formFactor as string,
            protocol: this.createSSDComponentForm.value.protocol as string
        };

        return ssdComponentRequest;
    }
}