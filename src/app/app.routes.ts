import { Routes } from '@angular/router';
import { StudentAuthGuard } from './core/guards/student-auth-guard.guard';
import { ExaminerAuthGuard } from './core/guards/examiner-auth-guard.guard';

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
            import('./pages/auth/login/login').then((m) => m.Login)
    },

    {
        path: 'register',
        loadComponent: () =>
            import('./pages/auth/register/register').then((m) => m.Register)
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
                path: 'exams/instruction/:id',
                loadComponent: () =>
                    import(
                        './pages/student/dashboard/exams/exam-instruction/exam-instruction'
                    ).then((m) => m.ExamInstruction),
            },
            {
                path: 'results',
                loadComponent: () =>
                    import('./pages/student/dashboard/results/results').then(
                        (m) => m.Results
                    ),
            },
            {
                path: 'results/:id',
                loadComponent: () =>
                    import(
                        './pages/student/dashboard/results/exam-result/exam-result'
                    ).then((m) => m.ExamResult),
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('./pages/student/dashboard/profile/profile').then(
                        (m) => m.Profile
                    ),
            },
        ],
        canActivate: [StudentAuthGuard],
    },

    {
        path: 'examiner',
        loadComponent: () =>
            import('./pages/examiner/dashboard/dashboard').then((m) => m.Dashboard),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            {
                path: 'home',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/home/home').then((m) => m.Home),
            },
            {
                path: 'exams',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/exams/exams').then((m) => m.Exams),
            },
            {
                path: 'exams/create',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/exams/create-exam/create-exam').then((m) => m.CreateExam),
            },
            {
                path: 'exams/details/:id',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/exams/exam-details/exam-details').then((m) => m.ExamDetails),
            },
            {
                path: 'exams/edit/:id',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/exams/edit-exam/edit-exam').then((m) => m.EditExam),
            },
            {
                path: 'results',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/result/result').then((m) => m.Result),
            },
            {
                path: 'results/details/:id',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/result/result-details/result-details').then((m) => m.ResultDetails),
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/profile/profile').then(
                        (m) => m.Profile
                    ),
            },
        ],
        canActivate: [ExaminerAuthGuard],
    },

    // 🔹 Exam Session (outside student dashboard)
    {
        path: 'exam-session/:id',
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
