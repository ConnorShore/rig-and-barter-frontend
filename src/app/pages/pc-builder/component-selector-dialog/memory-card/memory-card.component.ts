import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { IComponent } from "src/app/models/pc-builder/component";
import { IMemoryComponent } from "src/app/models/pc-builder/memory-component";


@Component({
    selector: 'rb-memory-card',
    standalone: true,
    templateUrl: './memory-card.component.html',
    styleUrl: './memory-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class MemoryCardComponent {
    @Input() memoryComponent: IMemoryComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.memoryComponent);
    }
}