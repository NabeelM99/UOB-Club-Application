import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolunteeringPage } from './volunteering.page';

describe('VolunteeringPage', () => {
  let component: VolunteeringPage;
  let fixture: ComponentFixture<VolunteeringPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VolunteeringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
