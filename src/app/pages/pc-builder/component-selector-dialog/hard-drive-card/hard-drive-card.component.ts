import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { IComponent } from "src/app/models/pc-builder/component";
import { IHardDriveComponent } from "src/app/models/pc-builder/hard-drive-component";
import { IVideoCardComponent } from "src/app/models/pc-builder/video-card-component";


@Component({
    selector: 'rb-hard-drive-card',
    standalone: true,
    templateUrl: './hard-drive-card.component.html',
    styleUrl: './hard-drive-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class HardDriveCardComponent {
    @Input() hddComponent: IHardDriveComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.hddComponent);
    }

    getSizeString(): string {
        if(this.hddComponent.size > 1000) {
            return (this.hddComponent.size / 1000) + "TB";
        }

        return this.hddComponent.size + "GB";
    }
}