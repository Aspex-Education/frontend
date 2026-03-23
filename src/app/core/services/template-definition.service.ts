import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TemplateDefinition } from '../models/template-definition.model';
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
}
