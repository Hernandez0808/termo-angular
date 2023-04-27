import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteConfetesComponent } from './teste-confetes.component';

describe('TesteConfetesComponent', () => {
  let component: TesteConfetesComponent;
  let fixture: ComponentFixture<TesteConfetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TesteConfetesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteConfetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
