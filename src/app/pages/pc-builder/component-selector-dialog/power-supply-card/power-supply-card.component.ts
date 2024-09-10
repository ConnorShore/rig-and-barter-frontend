import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { IComponent } from "src/app/models/pc-builder/component";
import { IPowerSupplyComponent } from "src/app/models/pc-builder/power-supply-component";


@Component({
    selector: 'rb-power-supply-card',
    standalone: true,
    templateUrl: './power-supply-card.component.html',
    styleUrl: './power-supply-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class PowerSupplyCardComponent {
    @Input() powerSupplyComponent: IPowerSupplyComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.powerSupplyComponent);
    }
}