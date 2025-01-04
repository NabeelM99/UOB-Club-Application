import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentPage } from './environment.page';

describe('EnvironmentPage', () => {
  let component: EnvironmentPage;
  let fixture: ComponentFixture<EnvironmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnvironmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
