import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ComponentCategory } from 'src/app/models/component-category';
import { IComponent } from 'src/app/models/pc-builder/component';
import { ComponentService } from 'src/app/services/component.service';

@Component({
  selector: 'rb-component-selector',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    TitleCasePipe,
    LowerCasePipe
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

  constructor(private readonly componentService: ComponentService) { }

  ngOnInit(): void {
    this.componentService.getComponentsOfCategory(this.category).subscribe(components => {
      this.componentsOfCategory = components;
    });
  }

  selectComponent(): void {
    // TODO: Open a dialog to select a component of given category
    console.log('Selecting component: ', this.componentToString());
  }

  componentToString(): string {
    return ComponentCategory[this.category].replace(/_/g, ' ');
  }
}

// TODO: Add a dialog to select a component (Should take up alot of page space)