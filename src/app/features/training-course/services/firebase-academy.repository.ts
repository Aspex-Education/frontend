import { Injectable } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { IVirtualAcademyRepository, UserPermission, CourseVideo } from '../models/academy.models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAcademyRepository implements IVirtualAcademyRepository {
  private db = getFirestore();

  async hasAccess(email: string): Promise<boolean> {
    try {
      const userCourseRef = collection(this.db, 'userCourse');
      const q = query(userCourseRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  }

  async getAvailableClasses(): Promise<CourseVideo[]> {
    try {
      const coursesRef = collection(this.db, 'courses');
      const q = query(coursesRef, orderBy('classNumber'));
      const querySnapshot = await getDocs(q);
      const courses: CourseVideo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        courses.push({
          classNumber: data['classNumber'],
          name: data['name'],
          url: data['url']
        });
      });
      return courses;
    } catch (error) {
      console.error('Error getting courses:', error);
      return [];
    }
  }
}