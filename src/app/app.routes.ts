import { Routes } from '@angular/router';
import { Login } from './pages/student/auth/login/login';
import { Dashboard } from './pages/student/dashboard/dashboard';
import { Home } from './pages/student/dashboard/home/home';
import { Exams } from './pages/student/dashboard/exams/exams';
import { ExamInstruction } from './pages/student/dashboard/exams/exam-instruction/exam-instruction';
import { ExamSession } from './pages/student/dashboard/exams/exam-session/exam-session';
import { ExamResult } from './pages/student/dashboard/exams/exam-result/exam-result';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "student",
        component: Dashboard,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full"
            },
            {
                path: "home",
                component: Home
            },
            {
                path: "exams",
                component: Exams,
            },
            {
                path: "exams/instruction",
                component: ExamInstruction
            },
            {
                path: "exams/result",
                component: ExamResult
            },
        ]
    },
            {
                path: "exam-session",
                component: ExamSession
            },
];
