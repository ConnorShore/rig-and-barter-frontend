import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ComponentCategory } from 'src/app/models/component-category';
import { ICaseComponent } from 'src/app/models/pc-builder/case-component';
import { IComponent } from 'src/app/models/pc-builder/component';
import { IHardDriveComponent } from 'src/app/models/pc-builder/hard-drive-component';
import { IMemoryComponent } from 'src/app/models/pc-builder/memory-component';
import { IMotherboardComponent } from 'src/app/models/pc-builder/motherboard-component';
import { IPowerSupplyComponent } from 'src/app/models/pc-builder/power-supply-component';
import { IProcessorComponent } from 'src/app/models/pc-builder/processor-component';
import { ISolidStateDriveComponent } from 'src/app/models/pc-builder/solid-state-drive-component';
import { IVideoCardComponent } from 'src/app/models/pc-builder/video-card-component';
import { CaseCardComponent } from './case-card/case-card.component';
import { ComponentService } from 'src/app/services/component.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { CpuCardComponent } from './cpu-card/cpu-card.component';
import { GpuCardComponent } from './gpu-card/gpu-card.component';
import { HardDriveCardComponent } from './hard-drive-card/hard-drive-card.component';
import { SolidStateDriveCardComponent } from './solid-state-drive-card/solid-state-drive-card.component';
import { MemoryCardComponent } from './memory-card/memory-card.component';
import { MotherboardCardComponent } from './motherboard-card/motherboard-card.component';
import { PowerSupplyCardComponent } from './power-supply-card/power-supply-card.component';
import { CreateComponentComponent } from "../create-component/create-component.component";

export interface IComponentSelectorData {
  category: ComponentCategory;
  name: string;
  components: IComponent[];
  numItems: number;
}

@Component({
  selector: 'rb-component-selector-dialog',
  standalone: true,
  templateUrl: './component-selector-dialog.component.html',
  styleUrl: './component-selector-dialog.component.scss',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatCardModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TitleCasePipe,
    CaseCardComponent,
    CpuCardComponent,
    GpuCardComponent,
    HardDriveCardComponent,
    SolidStateDriveCardComponent,
    MemoryCardComponent,
    MotherboardCardComponent,
    PowerSupplyCardComponent,
    CreateComponentComponent
]
})
export class ComponentSelectorDialogComponent {
  readonly dialogRef = inject(MatDialogRef);

  data: IComponentSelectorData = inject(MAT_DIALOG_DATA);

  pageSize = 25;
  pageIndex = 0;
  showFirstLastButtons = true;

  searchInputTest = new FormControl('');
  inputSubject: Subscription;

  searchInput = new Subject<EventTarget | null>();
  selectedComponent: IComponent;

  isCreatingComponent = false;

  constructor(private readonly componentService: ComponentService) {
    this.inputSubject = this.searchInputTest.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after each keystroke
        distinctUntilChanged() // Only trigger if the value has changed
      )
      .subscribe(async (searchTerm) => {
        this.componentService.getPagedComponentsOfCategory(this.data.category, this.pageIndex, this.pageSize, 'name', false, searchTerm as string)
        .subscribe(pagedComponent => {
          this.data.numItems = pagedComponent.numItems;
          this.data.components = pagedComponent.components;
        });
      });
  }

  handlePageEvent(event: PageEvent) {
    this.componentService.getPagedComponentsOfCategory(this.data.category, event.pageIndex, event.pageSize, 'name', false, this.searchInputTest.value as string)
      .subscribe(pagedComponent => {
        this.data.numItems = pagedComponent.numItems;
        this.data.components = pagedComponent.components;
      });

    this.pageIndex = event.pageIndex;
  }

  createComponent(category: ComponentCategory) {
    console.log('create component triggered');
    this.isCreatingComponent = true;
  }

  componentCreated(component: IComponent) {
    console.log('component created triggered: ', component);
    this.data.components.push(component);
    this.data.numItems++;
    this.isCreatingComponent = false;
  }

  setSelectedComponent(component: IComponent): void {
    this.selectedComponent = component;
  }

  toggleCreateComponent(val: boolean) {
    this.isCreatingComponent = val;
  }

  getTypedComponentCase(component: IComponent): ICaseComponent {
    return component as ICaseComponent;
  }

  getTypedComponentProcessor(component: IComponent): IProcessorComponent {
    return component as IProcessorComponent;
  }

  getTypedComponentMotherboard(component: IComponent): IMotherboardComponent {
    return component as IMotherboardComponent;
  }

  getTypedComponentMemory(component: IComponent): IMemoryComponent {
    return component as IMemoryComponent;
  }

  getTypedComponentSolidStateDrive(component: IComponent): ISolidStateDriveComponent {
    return component as ISolidStateDriveComponent;
  }

  getTypedComponentHardDrive(component: IComponent): IHardDriveComponent {
    return component as IHardDriveComponent;
  }

  getTypedComponentVideoCard(component: IComponent): IVideoCardComponent {
    return component as IVideoCardComponent;
  }

  getTypedComponentPowerSupply(component: IComponent): IPowerSupplyComponent {
    return component as IPowerSupplyComponent;
  }

  get ComponentCategory() {
    return ComponentCategory;
  }

}