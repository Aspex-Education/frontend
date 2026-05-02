import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import { environmentFirebase } from '../../../environments/environment.firebase';
import { Feedback } from '../models/feedback.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private db: Firestore | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (!environmentFirebase || !environmentFirebase.firebase || !environmentFirebase.firebase.projectId) {
      console.warn('Firebase configuration missing. Feedback service is disabled.');
      return;
    }

    try {
      const app = getApps().length === 0 ? initializeApp(environmentFirebase.firebase) : getApps()[0];
      this.db = getFirestore(app);
    } catch (error) {
      console.error('Failed to initialize Firestore for FeedbackService:', error);
    }
  }

  sendFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Observable<any> {
    if (!this.db) {
      throw new Error('Firestore not initialized');
    }

    const feedbackData: Feedback = {
      ...feedback,
      createdAt: new Date()
    };

    const feedbackCollection = collection(this.db, 'feedbacks');
    return from(addDoc(feedbackCollection, feedbackData));
  }
}
