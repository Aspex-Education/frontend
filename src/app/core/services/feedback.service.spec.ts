import { TestBed } from '@angular/core/testing';
import { FeedbackService } from './feedback.service';
import { of } from 'rxjs';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have sendFeedback method', () => {
    expect(service.sendFeedback).toBeDefined();
  });
});
