import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/shared/loader/loader.service';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.incrementRequestCount();

  return next(req).pipe(
    finalize(() => {
      loaderService.decrementRequestCount();
    })
  );
};
