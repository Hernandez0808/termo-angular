import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticasModalComponent } from './statisticas-modal.component';

describe('StatisticasModalComponent', () => {
  let component: StatisticasModalComponent;
  let fixture: ComponentFixture<StatisticasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticasModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
