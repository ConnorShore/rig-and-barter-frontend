import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ComponentCategory } from "src/app/models/component-category";
import { IVideocardComponentRequest } from "src/app/models/component/video-card-component-request";


@Component({
    selector: 'rb-gpu-component',
    standalone: true,
    templateUrl: './gpu-component.component.html',
    styleUrl: './gpu-component.component.scss',
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
export class GPUComponentComponent {

    createGpuComponentForm = new FormGroup({
        length: new FormControl(),
        slots: new FormControl(),
        numHDMIs: new FormControl(),
        numDisplayPorts: new FormControl(),
        boostClock: new FormControl(),
        vram: new FormControl(),
    });

    getCurrentVideoCardComponentValues() {
        const videoCardComponentRequest: IVideocardComponentRequest = {
            name: '',
            manufacturer: '',
            componentCategory: ComponentCategory.GPU,
            length: this.createGpuComponentForm.value.length as number,
            slots: this.createGpuComponentForm.value.slots as number,
            numHDMIs: this.createGpuComponentForm.value.numHDMIs as number,
            numDisplayPorts: this.createGpuComponentForm.value.numDisplayPorts as number,
            boostClock: this.createGpuComponentForm.value.boostClock as number,
            vram: this.createGpuComponentForm.value.vram as number
        };

        return videoCardComponentRequest;
    }
}