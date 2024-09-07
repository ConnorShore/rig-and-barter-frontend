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
    CaseCardComponent,
    MatPaginatorModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentSelectorDialogComponent {
  readonly dialogRef = inject(MatDialogRef);
  data: IComponentSelectorData = inject(MAT_DIALOG_DATA);

  constructor(private readonly componentService: ComponentService) { }

  pageSize = 25;
  pageIndex = 0;
  showFirstLastButtons = true;

  handlePageEvent(event: PageEvent) {
    console.log('page event: ', event);
    this.componentService.getPagedComponentsOfCategory(this.data.category, event.pageIndex, event.pageSize, 'name', false)
      .subscribe(pagedComponent => {
        console.log('pagedComponent: ', pagedComponent);
        this.data.numItems = pagedComponent.numItems;
        this.data.components = pagedComponent.components;
      });

    this.pageIndex = event.pageIndex;
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