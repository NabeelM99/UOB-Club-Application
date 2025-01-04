import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotographyPage } from './photography.page';

describe('PhotographyPage', () => {
  let component: PhotographyPage;
  let fixture: ComponentFixture<PhotographyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PhotographyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
