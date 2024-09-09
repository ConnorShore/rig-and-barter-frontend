import { LowerCasePipe, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentCategory } from 'src/app/models/component-category';
import { IComponent } from 'src/app/models/pc-builder/component';
import { ComponentService } from 'src/app/services/component.service';
import { ComponentSelectorDialogComponent, IComponentSelectorData } from '../component-selector-dialog/component-selector-dialog.component';

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

  // TODO: Need to get the current set of compoennts when build is saved (need to pass them to the build editor component)

  componentsOfCategory: IComponent[];
  numItems: number;

  constructor(
    private readonly componentService: ComponentService,
    private readonly componentSelectDialog: MatDialog,
    private readonly ngDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('category1: ', this.category);
    console.log('maxComponents1: ', this.maxComponents);
    if(this.category !== undefined) {
      this.componentService.getPagedComponentsOfCategory(this.category, 0, 20, 'name', false, '')
        .subscribe(pagedComponent => {
          console.log('pagedComponent: ', pagedComponent);
          this.numItems = pagedComponent.numItems;
          this.componentsOfCategory = pagedComponent.components;
        });
    }
  }

  selectComponent(): void {
    console.log('select category: ', ComponentCategory[this.category]);
    console.log('select components: ', this.componentsOfCategory);
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
        // Save to db and update the list of components
        console.log('selected component: ', selectedComponent);
        this.components.push(selectedComponent);
        this.ngDetectorRef.detectChanges();
      }
    });
  }

  componentToString(): string {
    if(this.category === undefined) {
      return '';
    }

    return ComponentCategory[this.category].replace(/_/g, ' ');
  }
}