import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 🔹 Login (lazy-loaded)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/student/auth/login/login').then((m) => m.Login),
  },

  // 🔹 Student Dashboard (with nested routes)
  {
    path: 'student',
    loadComponent: () =>
      import('./pages/student/dashboard/dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/student/dashboard/home/home').then((m) => m.Home),
      },
      {
        path: 'exams',
        loadComponent: () =>
          import('./pages/student/dashboard/exams/exams').then((m) => m.Exams),
      },
      {
        path: 'exams/instruction',
        loadComponent: () =>
          import(
            './pages/student/dashboard/exams/exam-instruction/exam-instruction'
          ).then((m) => m.ExamInstruction),
      },
      {
        path: 'exams/result',
        loadComponent: () =>
          import(
            './pages/student/dashboard/exams/exam-result/exam-result'
          ).then((m) => m.ExamResult),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./pages/student/dashboard/results/results').then(
            (m) => m.Results
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/student/dashboard/profile/profile').then(
            (m) => m.Profile
          ),
      },
    ],
  },

  // 🔹 Exam Session (outside student dashboard)
  {
    path: 'exam-session',
    loadComponent: () =>
      import('./pages/student/dashboard/exams/exam-session/exam-session').then(
        (m) => m.ExamSession
      ),
  },

  // 🔹 Fallback (optional)
  {
    path: '**',
    redirectTo: 'login',
  },
];
