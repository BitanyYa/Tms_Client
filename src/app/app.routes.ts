import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard')
        .then(m => m.InstructorDashboardComponent)
  },
  {
    path: 'enrollments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list.component')
        .then(m => m.EnrollmentListComponent)
  },
  {
    path: 'grade-submission',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/grade-submission/grade-submission')
        .then(m => m.GradeSubmissionComponent)
  },
  { path: 'enroll', redirectTo: 'enrollments', pathMatch: 'full' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];