import { Component, Input } from '@angular/core';
import { ComponentSelectorComponent } from "../component-selector/component-selector.component";
import { MatCardModule } from '@angular/material/card';
import { ComponentCategory } from 'src/app/models/component-category';
import { IPCBuild } from 'src/app/models/pc-builder/pc-build';
import { IComponent } from 'src/app/models/pc-builder/component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'rb-build-editor',
  standalone: true,
  imports: [
    ComponentSelectorComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './build-editor.component.html',
  styleUrl: './build-editor.component.scss'
})
export class BuildEditorComponent {

  @Input() build: IPCBuild | undefined;

  getComponentsForCategory(categroy: ComponentCategory): IComponent[] {
    switch(categroy) {
      case ComponentCategory.CPU:
        return this.build?.cpuComponent ? [this.build.cpuComponent] : [];
      case ComponentCategory.MOTHERBOARD:
        return this.build?.motherboardComponent ? [this.build.motherboardComponent] : [];
      case ComponentCategory.MEMORY:
        return this.build?.memoryComponents ? this.build.memoryComponents : [];
      case ComponentCategory.SOLID_STATE_DRIVE:
        return this.build?.solidStateDriveComponents ? this.build.solidStateDriveComponents : [];
      case ComponentCategory.HARD_DRIVE:
        return this.build?.hardDriveComponents ? this.build.hardDriveComponents : [];
      case ComponentCategory.GPU:
        return this.build?.gpuComponent ? [this.build.gpuComponent] : [];
      case ComponentCategory.POWER_SUPPLY:
        return this.build?.powerSupplyComponent ? [this.build.powerSupplyComponent] : [];
      case ComponentCategory.CASE:
        return this.build?.caseComponent ? [this.build.caseComponent] : [];
      default:
        return [];
    }
  }
  
  get ComponentCategory() {
    return ComponentCategory;
  }
}
