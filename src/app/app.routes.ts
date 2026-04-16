import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { GuestGuard } from './auth/guards/guest.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { TemplateDetailComponent } from './features/template-detail/template-detail.component';
import { TemplateCreateComponent } from './features/template-create/template-create.component';
import { TemplateViewComponent } from './features/template-view/template-view.component';
import { UserTemplatesComponent } from './features/user-templates/user-templates.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { PrivacyPolicyComponent } from './legal/privacy-policy.component';
import { PriceEngineComponent } from './features/price-engine/price-engine.component';
export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [GuestGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'my-templates', component: UserTemplatesComponent },
      { path: 'templatesDefinition/:id', component: TemplateDetailComponent },
      { path: 'templates/:type/create', component: TemplateCreateComponent, canDeactivate: [unsavedChangesGuard] },
      { path: 'templates/:id/edit', component: TemplateCreateComponent, canDeactivate: [unsavedChangesGuard] },
      { path: 'templates/:type/guide', component: TemplateViewComponent },
      { path: 'templates/:id/view', component: TemplateViewComponent },
      { path: 'about', component: HomeComponent },
      { path: 'privacy', component: PrivacyPolicyComponent }
    ]
  },
  { path: 'landing', component: PriceEngineComponent },

];
