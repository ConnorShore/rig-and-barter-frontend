import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComponentCategory } from 'src/app/models/component-category';
import { IComponent } from 'src/app/models/pc-builder/component';
import { ComponentService } from 'src/app/services/component.service';
import { NotificationService } from 'src/app/services/notification.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';
import { CaseComponentComponent } from "./case-component/case-component.component";
import { SolidStateDriveComponentComponent } from "./solid-state-drive-component/solid-state-drivev-component.component";
import { HardDriveComponentComponent } from "./hard-drive-component/hard-drive-component.component";
import { MemoryComponentComponent } from "./memory-component/memory-component.component";
import { PowerSupplyComponentComponent } from "./power-supply-component/power-supply-component.component";
import { MotherboardComponentComponent } from "./motherboard-component/motherboard-component.component";
import { GPUComponentComponent } from "./gpu-component/gpu-component.component";
import { CPUComponentComponent } from "./cpu-component/cpu-component.component";
import { TitleCasePipe } from '@angular/common';
import { IComponentRequest } from 'src/app/models/component/component-request';
import { ICaseComponentRequest } from 'src/app/models/component/case-component-request';

@Component({
  selector: 'rb-create-component',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FileDragAndDropComponent,
    CaseComponentComponent,
    SolidStateDriveComponentComponent,
    HardDriveComponentComponent,
    MemoryComponentComponent,
    PowerSupplyComponentComponent,
    MotherboardComponentComponent,
    GPUComponentComponent,
    CPUComponentComponent,
    TitleCasePipe
  ],
  templateUrl: './create-component.component.html',
  styleUrl: './create-component.component.scss'
})
export class CreateComponentComponent implements OnInit {

  @Input() componentCategory: ComponentCategory;

  @Output() formClosed = new EventEmitter<void>();
  @Output() componentCreated = new EventEmitter<IComponent>();

  @ViewChild(CaseComponentComponent) caseComponent: CaseComponentComponent;
  @ViewChild(SolidStateDriveComponentComponent) solidStateDriveComponent: SolidStateDriveComponentComponent;
  @ViewChild(HardDriveComponentComponent) hardDriveComponent: HardDriveComponentComponent;
  @ViewChild(MemoryComponentComponent) memoryComponent: MemoryComponentComponent;
  @ViewChild(PowerSupplyComponentComponent) powerSupplyComponent: PowerSupplyComponentComponent;
  @ViewChild(MotherboardComponentComponent) motherboardComponent: MotherboardComponentComponent;
  @ViewChild(GPUComponentComponent) gpuComponent: GPUComponentComponent;
  @ViewChild(CPUComponentComponent) cpuComponent: CPUComponentComponent;

  createComponentForm = new FormGroup({
    name: new FormControl(''),
    manufacturer: new FormControl(''),
    componentCategory: new FormControl()
  });

  componentImage: File;

  constructor(
      private dialogRef: MatDialogRef<CreateComponentComponent>,
      private componentService: ComponentService,
      private notificationService: NotificationService) { }

  ngOnInit(): void {
  
  }
  
  onSubmit() {
    let componentSpecifics: IComponentRequest = {} as IComponentRequest;

    switch(this.componentCategory) {
      case ComponentCategory.CASE:
        componentSpecifics = this.caseComponent.getCurrentCaseComponentValues() as ICaseComponentRequest;
        break;
      // case ComponentCategory.SOLID_STATE_DRIVE:
      //   this.solidStateDriveComponent.getCurrentSolidStateDriveComponentValues();
      //   break;
      // case ComponentCategory.HARD_DRIVE:
      //   this.hardDriveComponent.getCurrentHardDriveComponentValues();
      //   break;
      // case ComponentCategory.MEMORY:
      //   this.memoryComponent.getCurrentMemoryComponentValues();
      //   break;
      // case ComponentCategory.POWER_SUPPLY:
      //   this.powerSupplyComponent.getCurrentPowerSupplyComponentValues();
      //   break;
      // case ComponentCategory.MOTHERBOARD:
      //   this.motherboardComponent.getCurrentMotherboardComponentValues();
      //   break;
      // case ComponentCategory.GPU:
      //   this.gpuComponent.getCurrentGPUComponentValues();
      //   break;
      // case ComponentCategory.CPU:
      //   this.cpuComponent.getCurrentCPUComponentValues();
      //   break;
    }

    componentSpecifics.name = this.createComponentForm.value.name as string;
    componentSpecifics.manufacturer = this.createComponentForm.value.manufacturer as string;

    this.componentService.createComponent(componentSpecifics, this.componentImage).subscribe(component => {
      this.notificationService.showSuccess('Your component is now available to the public', 'Component Created');
      this.componentCreated.emit(component);
      this.closeDialog();
    });
  }

  setSelectedFiles(files: File[]) {
    this.componentImage = files[0];
  }

  closeDialog() {
    this.formClosed.emit();
  }

  componentName() {
    return ComponentCategory[this.componentCategory].replace(/_/g, ' ');
  }

  get ComponentCategory() {
    return ComponentCategory;
  }
}
