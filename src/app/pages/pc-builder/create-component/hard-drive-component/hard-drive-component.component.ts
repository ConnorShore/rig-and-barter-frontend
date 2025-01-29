import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { IHardDriveComponentRequest } from "src/app/models/component/hard-drive-component-request";


@Component({
    selector: 'rb-hard-drive-component',
    standalone: true,
    templateUrl: './hard-drive-component.component.html',
    styleUrl: './hard-drive-component.component.scss',
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
export class HardDriveComponentComponent {

    createHardDriveComponentForm = new FormGroup({
        size: new FormControl(),
        rpm: new FormControl(),
        cacheSize: new FormControl(),
    });

    getCurrentHardDriveComponentValues() {
        const hardDriveComponentRequest: IHardDriveComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.HARD_DRIVE,
            size: this.createHardDriveComponentForm.value.size as number,
            rpm: this.createHardDriveComponentForm.value.rpm as number,
            cacheSize: this.createHardDriveComponentForm.value.cacheSize as number
        };

        return hardDriveComponentRequest
    }
}