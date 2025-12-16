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
                path: 'exams/details',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/exams/exam-details/exam-details').then((m) => m.ExamDetails),
            },
            {
                path: 'exams/edit',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/exams/edit-exam/edit-exam').then((m) => m.EditExam),
            },
            {
                path: 'results',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/result/result').then((m) => m.Result),
            },
            {
                path: 'results/details',
                loadComponent: () =>
                    import('./pages/examiner/dashboard/result/result-details/result-details').then((m) => m.ResultDetails),
            },
        ]
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
