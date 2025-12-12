import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { AlertService } from '../services/shared/alert/alert.service';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'An unexpected error occurred. Please try again.';
      let technicalMessage = '';
      let shouldAlert = true;

      if (error.error instanceof ErrorEvent) {
        userMessage = 'Network error: Please check your internet connection.';
        technicalMessage = error.error.message;
      } else {
        const backendMessage =
          (error.error?.message || error.error?.error || error.message) ?? '';

        technicalMessage = backendMessage;

        switch (error.status) {
          case 0:
            userMessage = 'Unable to connect to the server. Please try again later.';
            break;

          case 400:
            userMessage = backendMessage || 'Bad request. Please verify your input.';
            break;

          case 403:
            userMessage = 'You do not have permission to perform this action.';
            break;

          case 404:
            userMessage = 'The requested resource could not be found.';
            break;

          case 408:
            userMessage = 'The request timed out. Please try again.';
            break;

          case 500:
            userMessage =
              backendMessage ||
              'A server error occurred. Our team has been notified.';
            break;

          case 502:
          case 503:
          case 504:
            userMessage =
              'The server is temporarily unavailable. Please try again later.';
            break;

          default:
            userMessage = backendMessage || `Unexpected error (${error.status}).`;
            break;
        }
      }

      if (shouldAlert && userMessage) {
        alertService.error(userMessage);
      }

      console.error('HTTP ERROR LOG:', {
        url: req.url,
        status: error.status,
        message: technicalMessage || error.message,
        fullError: error,
      });

      return throwError(() => error);
    })
  );
};
