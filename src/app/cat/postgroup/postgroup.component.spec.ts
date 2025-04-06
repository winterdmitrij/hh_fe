import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgroupComponent } from './postgroup.component';

describe('PostgroupComponent', () => {
  let component: PostgroupComponent;
  let fixture: ComponentFixture<PostgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
