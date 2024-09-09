import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { ICaseComponent } from "src/app/models/pc-builder/case-component";
import { IComponent } from "src/app/models/pc-builder/component";


@Component({
    selector: 'rb-case-card',
    standalone: true,
    templateUrl: './case-card.component.html',
    styleUrl: './case-card.component.scss',
    imports:[
        MatCardModule
    ]
})
export class CaseCardComponent {
    @Input() caseComponent: ICaseComponent;
    @Input() isSelected: boolean;
    @Output() componentSelected = new EventEmitter<IComponent>();

    setComponent(): void {
        this.componentSelected.emit(this.caseComponent);
    }
}