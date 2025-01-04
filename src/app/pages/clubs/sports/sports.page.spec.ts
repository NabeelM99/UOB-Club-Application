import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SportsPage } from './sports.page';

describe('SportsPage', () => {
  let component: SportsPage;
  let fixture: ComponentFixture<SportsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
