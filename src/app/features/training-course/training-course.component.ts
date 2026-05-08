import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FirebaseAcademyRepository } from './services/firebase-academy.repository';
import { CourseVideo } from './models/academy.models';
import { UniversalPlayerComponent } from './components/universal-player.component';
import { getUserEmailFromToken } from './utils/auth-helper';

@Component({
  selector: 'app-training-course',
  standalone: true,
  imports: [CommonModule, ToastModule, UniversalPlayerComponent],
  templateUrl: './training-course.component.html',
  styleUrl: './training-course.component.css'
})
export class TrainingCourseComponent implements OnInit {
  private firebaseRepo = inject(FirebaseAcademyRepository);
  private messageService = inject(MessageService);

  courses = signal<CourseVideo[]>([]);
  hasAccess = signal<boolean>(false);
  loading = signal<boolean>(true);
  selectedCourse: CourseVideo | null = null;

  ngOnInit(): void {
    this.checkAccessAndLoadCourses();
  }

  private async checkAccessAndLoadCourses(): Promise<void> {
    this.loading.set(true);
    try {
      const email = getUserEmailFromToken();
      if (!email) {
        this.showAccessDenied();
        return;
      }

      const access = await this.firebaseRepo.hasAccess(email);
      this.hasAccess.set(access);

      if (access) {
        const availableCourses = await this.firebaseRepo.getAvailableClasses();
        this.courses.set(availableCourses);
      } else {
        this.showAccessDenied();
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los cursos'
      });
    } finally {
      this.loading.set(false);
    }
  }

  private showAccessDenied(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Acceso Denegado',
      detail: 'No tienes acceso a los cursos. Contacta a la asociación.'
    });
  }

  selectVideo(video: CourseVideo): void {
    this.selectedCourse = video;
  }

  trackByClassNumber(_index: number, item: CourseVideo): number {
    return item.classNumber;
  }
}