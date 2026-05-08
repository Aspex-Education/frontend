export interface UserPermission {
  email: string;
  name: string;
}

export interface CourseVideo {
  classNumber: number;
  name: string;
  url: string;
}

export interface IVirtualAcademyRepository {
  hasAccess(email: string): Promise<boolean>;
  getAvailableClasses(): Promise<CourseVideo[]>;
}