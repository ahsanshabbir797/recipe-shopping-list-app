import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService:AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(take(1),exhaustMap(user => {
            console.log("User in interceptor:::",user)
            if(!user) {
                return next.handle(req);
            }
            console.log("User in interceptor after:::", user)
            const modifiedRequest = req.clone({params:new HttpParams().set('auth',user.token)})
            return next.handle(modifiedRequest)
        }))
    }
}