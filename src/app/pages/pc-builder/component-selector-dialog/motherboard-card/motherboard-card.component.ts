import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { IComponent } from "src/app/models/pc-builder/component";
import { IMemoryComponent } from "src/app/models/pc-builder/memory-component";
import { IMotherboardComponent } from "src/app/models/pc-builder/motherboard-component";


@Component({
    selector: 'rb-motherboard-card',
    standalone: true,
    templateUrl: './motherboard-card.component.html',
    styleUrl: './motherboard-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class MotherboardCardComponent {
    @Input() motherboardComponent: IMotherboardComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.motherboardComponent);
    }
}