import { LowerCasePipe, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentCategory } from 'src/app/models/component-category';
import { IComponent } from 'src/app/models/pc-builder/component';
import { ComponentService } from 'src/app/services/component.service';
import { ComponentSelectorDialogComponent, IComponentSelectorData } from '../component-selector-dialog/component-selector-dialog.component';

export interface IComponentModifiedData {
  category: ComponentCategory;
  component: IComponent;
  state: 'added' | 'removed';
}

@Component({
  selector: 'rb-component-selector',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    TitleCasePipe,
    LowerCasePipe,
    MatDialogModule,
    NgIf
  ],
  templateUrl: './component-selector.component.html',
  styleUrl: './component-selector.component.scss'
})
export class ComponentSelectorComponent implements OnInit{
  @Input() components: IComponent[];
  @Input() category: ComponentCategory;
  @Input() maxComponents: number = 1;

  @Output() componentModified = new EventEmitter<IComponentModifiedData>();

  componentsOfCategory: IComponent[];
  numItems: number;

  constructor(
    private readonly componentService: ComponentService,
    private readonly componentSelectDialog: MatDialog,
    private readonly ngDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if(this.category !== undefined) {
      this.componentService.getPagedComponentsOfCategory(this.category, 0, 20, 'name', false, '')
        .subscribe(pagedComponent => {
          this.numItems = pagedComponent.numItems;
          this.componentsOfCategory = pagedComponent.components;
        });
    }
  }

  selectComponent(currentComponent?: IComponent): void {
    this.componentSelectDialog.open(ComponentSelectorDialogComponent, {
      width: '80%',
      height: '80%',
      data: {
        category: this.category,
        name: this.componentToString(),
        components: this.componentsOfCategory,
        numItems: this.numItems
      } as IComponentSelectorData
    })
    .afterClosed().subscribe(selectedComponent => {
      if(selectedComponent) {

        if(currentComponent) {
          let data: IComponentModifiedData = {
            category: this.category,
            component: currentComponent,
            state: 'removed'
          };
          this.componentModified.emit(data);
        }

        let data: IComponentModifiedData = {
          category: this.category,
          component: selectedComponent,
          state:  'added'
        };

        this.componentModified.emit(data);
        this.ngDetectorRef.detectChanges();
      }
    });
  }

  removeComponent(component: IComponent) {
    let data: IComponentModifiedData = {
      category: this.category,
      component: component,
      state: 'removed'
    };
    this.componentModified.emit(data);
  }

  componentToString(): string {
    if(this.category === undefined) {
      return '';
    }

    return ComponentCategory[this.category].replace(/_/g, ' ');
  }
}