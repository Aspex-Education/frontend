import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackButtonComponent } from './feedback-button.component';
import { FeedbackService } from '../../../core/services/feedback.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';

describe('FeedbackButtonComponent', () => {
  let component: FeedbackButtonComponent;
  let fixture: ComponentFixture<FeedbackButtonComponent>;
  let feedbackServiceSpy: jasmine.SpyObj<FeedbackService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FeedbackService', ['sendFeedback']);
    const authSpy = jasmine.createSpyObj('AuthService', ['currentUserId']);
    authSpy.currentUserId.and.returnValue('test-user-id');


    await TestBed.configureTestingModule({
      imports: [FeedbackButtonComponent, ReactiveFormsModule],
      providers: [
        { provide: FeedbackService, useValue: spy },
        { provide: AuthService, useValue: authSpy }
      ]

    }).compileComponents();

    feedbackServiceSpy = TestBed.inject(FeedbackService) as jasmine.SpyObj<FeedbackService>;
    fixture = TestBed.createComponent(FeedbackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with modal closed', () => {
    expect(component.isOpen).toBeFalse();
  });

  it('should toggle modal', () => {
    component.toggleModal();
    expect(component.isOpen).toBeTrue();
    component.toggleModal();
    expect(component.isOpen).toBeFalse();
  });

  it('should invalidate form if message is empty', () => {
    component.feedbackForm.get('message')?.setValue('');
    expect(component.feedbackForm.valid).toBeFalse();
  });

  it('should call feedbackService when submitting', () => {
    feedbackServiceSpy.sendFeedback.and.returnValue(of({}));
    
    component.feedbackForm.get('message')?.setValue('This is a test message');
    component.submitFeedback();

    expect(feedbackServiceSpy.sendFeedback).toHaveBeenCalled();
    expect(component.submitted).toBeTrue();
  });
});
