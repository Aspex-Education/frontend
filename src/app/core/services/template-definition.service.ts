import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TemplateDefinition,
  CreateTemplateDefinitionRequest,
  UpdateTemplateDefinitionRequest,
} from '../models/template-definition.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateDefinitionService {
  private apiUrl = `${environment.apiTemplateUrl}/template-definitions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TemplateDefinition[]> {
    return this.http.get<TemplateDefinition[]>(this.apiUrl);
  }

  getById(id: string): Observable<TemplateDefinition> {
    return this.http.get<TemplateDefinition>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateTemplateDefinitionRequest): Observable<TemplateDefinition> {
    return this.http.post<TemplateDefinition>(this.apiUrl, payload);
  }

  update(id: string, payload: UpdateTemplateDefinitionRequest): Observable<TemplateDefinition> {
    return this.http.patch<TemplateDefinition>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
