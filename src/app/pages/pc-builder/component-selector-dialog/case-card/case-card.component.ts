import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { ICaseComponent } from "src/app/models/pc-builder/case-component";


@Component({
    selector: 'rb-case-card',
    standalone: true,
    templateUrl: './case-card.component.html',
    imports:[
        MatCardModule
    ],
    styles: []
})
export class CaseCardComponent {
    @Input() caseComponent: ICaseComponent;
}