import { HttpInterceptorFn } from '@angular/common/http';

export const createInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
