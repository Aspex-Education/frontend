import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../../../core/services/feedback.service';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'app-feedback-button',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback-button.component.html',
  styleUrls: ['./feedback-button.component.css']
})
export class FeedbackButtonComponent {
  isOpen = false;
  isSending = false;
  submitted = false;
  feedbackForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  toggleModal(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.submitted = false;
      this.feedbackForm.reset();
    }
  }

  closeModal(): void {
    this.isOpen = false;
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid || this.isSending) return;

    this.isSending = true;
    const feedback = {
      type: 'suggestion' as const,
      message: this.feedbackForm.value.message,
      userId: this.authService.currentUserId() || undefined
    };

    this.feedbackService.sendFeedback(feedback).subscribe({
      next: () => {
        this.isSending = false;
        this.submitted = true;
      },
      error: (err) => {
        console.error('Error sending feedback:', err);
        this.isSending = false;
      }
    });
  }
}
