import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { IComponent } from "src/app/models/pc-builder/component";
import { IProcessorComponent } from "src/app/models/pc-builder/processor-component";


@Component({
    selector: 'rb-cpu-card',
    standalone: true,
    templateUrl: './cpu-card.component.html',
    styleUrl: './cpu-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class CpuCardComponent {
    @Input() cpuComponent: IProcessorComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.cpuComponent);
    }
}