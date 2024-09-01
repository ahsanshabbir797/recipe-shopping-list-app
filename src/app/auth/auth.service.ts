import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private webAPIKey = 'AIzaSyDXDweg-pq--fG96WRRHE6KP7Z_J-e61Zc';
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    //create user on signup
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.webAPIKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((authRes) =>
          this.handleAuthentication(
            authRes.email,
            authRes.localId,
            authRes.idToken,
            +authRes.expiresIn
          )
        )
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userToken'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    console.log("asli pehle",loadedUser)

    if(loadedUser.token) {
        this.user.next(loadedUser);
        console.log("asliii",new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(),userData._tokenExpirationDate)
    // const remainingTime = expirationDate.getTime() - new Date().getTime();
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.webAPIKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((authRes) =>
          this.handleAuthentication(
            authRes.email,
            authRes.localId,
            authRes.idToken,
            +authRes.expiresIn
          )
        )
      );
  }

  autoLogout(expirationDuration: number) {
    console.log('expiration in autologout:::', expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userToken');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    let expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    let user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userToken', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage =
          'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        errorMessage =
          'The user account has been disabled by an administrator.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'The login credentials are not valid!';
        break;
    }
    return throwError(errorMessage);
  }
}
