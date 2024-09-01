import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService:AuthService,private router:Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        //manual redirecting via router is avoided as causes race conditions with unexpected results
        return this.authService.user.pipe(
            take(1),map(user => {
                const isAuthenticated = !!user
                if(isAuthenticated) {
                    return true
                }
                else {
                    return this.router.createUrlTree(['/auth'])
                }
            })
        )
    }
}