import { Injectable } from "@angular/core";
import { getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { environmentFirebase } from "../../../environments/environment.firebase";
import { Observable, of } from "rxjs";

@Injectable({  providedIn: 'root'})
export class TrainingCourseService {

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

    getUsersBuyersTheTraining(): Observable<any>{
        if (!this.db) {
            throw new Error('Firestore not initialized');
        }


        return of();
    }

    getCourses(): Observable<any>{
        if (!this.db) {
            throw new Error('Firestore not initialized');
        }
        return of();
    }
}