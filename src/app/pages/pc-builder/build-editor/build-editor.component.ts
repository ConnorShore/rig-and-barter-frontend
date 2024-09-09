import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentSelectorComponent, IComponentModifiedData } from "../component-selector/component-selector.component";
import { MatCardModule } from '@angular/material/card';
import { ComponentCategory } from 'src/app/models/component-category';
import { IPCBuild } from 'src/app/models/pc-builder/pc-build';
import { IComponent } from 'src/app/models/pc-builder/component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IProcessorComponent } from 'src/app/models/pc-builder/processor-component';
import { IMotherboardComponent } from 'src/app/models/pc-builder/motherboard-component';
import { IMemoryComponent } from 'src/app/models/pc-builder/memory-component';
import { ISolidStateDriveComponent } from 'src/app/models/pc-builder/solid-state-drive-component';
import { IHardDriveComponent } from 'src/app/models/pc-builder/hard-drive-component';
import { IVideoCardComponent } from 'src/app/models/pc-builder/video-card-component';
import { IPowerSupplyComponent } from 'src/app/models/pc-builder/power-supply-component';
import { ICaseComponent } from 'src/app/models/pc-builder/case-component';
import { IPCBuildRequest } from 'src/app/models/pc-builder/pc-build-request';
import { NotificationService } from 'src/app/services/notification.service';
import { PCBuilderService } from 'src/app/services/pc-builder.service';

@Component({
  selector: 'rb-build-editor',
  standalone: true,
  imports: [
    ComponentSelectorComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './build-editor.component.html',
  styleUrl: './build-editor.component.scss'
})
export class BuildEditorComponent implements OnInit {

  @Input() build: IPCBuild | undefined;
  @Output() buildUpdated = new EventEmitter<IPCBuild>();

  buildName: FormControl;
  currentBuildComponents: { [key: string]: IComponent[] } = {};

  constructor(
    private readonly pcBuilderService: PCBuilderService,
    private readonly notificationService: NotificationService,
    private readonly ngDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.buildName = new FormControl(this.build ? this.build.name : 'New Build');
    
    this.currentBuildComponents[ComponentCategory.CPU] = this.build?.cpuComponent ? [this.build.cpuComponent] : [];
    this.currentBuildComponents[ComponentCategory.MOTHERBOARD] = this.build?.motherboardComponent ? [this.build.motherboardComponent] : [];
    this.currentBuildComponents[ComponentCategory.MEMORY] = this.build?.memoryComponents ? this.build.memoryComponents : [];
    this.currentBuildComponents[ComponentCategory.SOLID_STATE_DRIVE] = this.build?.solidStateDriveComponents ? this.build.solidStateDriveComponents : [];
    this.currentBuildComponents[ComponentCategory.HARD_DRIVE] = this.build?.hardDriveComponents ? this.build.hardDriveComponents : [];
    this.currentBuildComponents[ComponentCategory.GPU] = this.build?.gpuComponent ? [this.build.gpuComponent] : [];
    this.currentBuildComponents[ComponentCategory.POWER_SUPPLY] = this.build?.powerSupplyComponent ? [this.build.powerSupplyComponent] : [];
    this.currentBuildComponents[ComponentCategory.CASE] = this.build?.caseComponent ? [this.build.caseComponent] : [];
  }

  saveBuild() {
    let updatedBuild: IPCBuildRequest = {
      name: this.buildName.value,
      cpuComponent: this.currentBuildComponents[ComponentCategory.CPU][0] as IProcessorComponent,
      motherboardComponent: this.currentBuildComponents[ComponentCategory.MOTHERBOARD][0] as IMotherboardComponent,
      memoryComponents: this.currentBuildComponents[ComponentCategory.MEMORY] as IMemoryComponent[],
      solidStateDriveComponents: this.currentBuildComponents[ComponentCategory.SOLID_STATE_DRIVE] as ISolidStateDriveComponent[],
      hardDriveComponents: this.currentBuildComponents[ComponentCategory.HARD_DRIVE] as IHardDriveComponent[],
      gpuComponent: this.currentBuildComponents[ComponentCategory.GPU][0] as IVideoCardComponent,
      powerSupplyComponent: this.currentBuildComponents[ComponentCategory.POWER_SUPPLY][0] as IPowerSupplyComponent,
      caseComponent: this.currentBuildComponents[ComponentCategory.CASE][0] as ICaseComponent
    };

    this.pcBuilderService.savePCBuild(updatedBuild).subscribe(pcBuild => {
      this.notificationService.showSuccess('Build saved successfully');
      this.build = pcBuild;
      this.buildUpdated.emit(pcBuild);
      this.ngDetectorRef.detectChanges();
    });
  }

  updateComponent(data: IComponentModifiedData): void {
    if(data.state === 'removed') {
      let index = this.currentBuildComponents[data.category].indexOf(data.component);
      this.currentBuildComponents[data.category].splice(index, 1);
    }
    else {
      this.currentBuildComponents[data.category].push(data.component);
    }
  }

  getCase(): ComponentCategory {
    return ComponentCategory.CASE;
  }
  
  get ComponentCategory() {
    return ComponentCategory;
  }
}
