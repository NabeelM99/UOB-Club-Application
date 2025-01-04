import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowMembersPage } from './show-members.page';

describe('ShowMembersPage', () => {
  let component: ShowMembersPage;
  let fixture: ComponentFixture<ShowMembersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
