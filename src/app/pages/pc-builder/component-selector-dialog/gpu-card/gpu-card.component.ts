import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { IComponent } from "src/app/models/pc-builder/component";
import { IVideoCardComponent } from "src/app/models/pc-builder/video-card-component";


@Component({
    selector: 'rb-gpu-card',
    standalone: true,
    templateUrl: './gpu-card.component.html',
    styleUrl: './gpu-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class GpuCardComponent {
    @Input() gpuComponent: IVideoCardComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.gpuComponent);
    }
}