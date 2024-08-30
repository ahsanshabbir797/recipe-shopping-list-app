import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit{
  isLoginMode = true;
  isLoading = false;
  error:string;


  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit(): void {
  }

  onSwitchModes() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return; // if user tricks to enable submit btn via dev tools then this additional step faced (this can be discarded too!)
    }

    const credentials = {
      email: authForm.value['email'],
      password: authForm.value['password'],
    };

    let authObs : Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(credentials.email,credentials.password)
    } 
    else {
      authObs = this.authService.signup(credentials.email, credentials.password)
    }

    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/recipes'])
        console.log('Success response:::', response);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
        console.log('Error Response:::', errorMessage);
      }
    );

    authForm.reset();
  }
}
