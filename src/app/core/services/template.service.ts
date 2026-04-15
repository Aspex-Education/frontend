import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template, CreateTemplateRequest } from '../models/template.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = `${environment.apiTemplateUrl}/templates`;

  constructor(private http: HttpClient) {}

  create(request: CreateTemplateRequest): Observable<Template> {
    return this.http.post<Template>(this.apiUrl, request);
  }

  getPublicByType(type: string): Observable<Template[]> {
    const params = new HttpParams()
      .set('type', type)
      .set('isPublic', 'true');
    return this.http.get<Template[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: string): Observable<Template[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Template[]>(this.apiUrl, { params });
  }
}
