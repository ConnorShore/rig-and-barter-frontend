import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { IComponent } from "src/app/models/pc-builder/component";
import { ISolidStateDriveComponent } from "src/app/models/pc-builder/solid-state-drive-component";


@Component({
    selector: 'rb-solid-state-drive-card',
    standalone: true,
    templateUrl: './solid-state-drive-card.component.html',
    styleUrl: './solid-state-drive-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class SolidStateDriveCardComponent {
    @Input() ssdComponent: ISolidStateDriveComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.ssdComponent);
    }

    getSizeString(): string {
        if(!this.ssdComponent) {
            return "";
        }

        if(this.ssdComponent.size > 1000) {
            return (this.ssdComponent.size / 1000) + " TB";
        }

        return this.ssdComponent.size + " GB";
    }
}