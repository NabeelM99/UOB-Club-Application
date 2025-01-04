import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraduatesPage } from './graduates.page';

describe('GraduatesPage', () => {
  let component: GraduatesPage;
  let fixture: ComponentFixture<GraduatesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GraduatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
