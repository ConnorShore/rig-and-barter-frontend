import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSelectorComponent } from './component-selector.component';

describe('ComponentSelectorComponent', () => {
  let component: ComponentSelectorComponent;
  let fixture: ComponentFixture<ComponentSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComponentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
