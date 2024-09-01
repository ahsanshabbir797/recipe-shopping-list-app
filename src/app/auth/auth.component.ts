import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertModalComponent } from '../shared/alert-modal/alert-modal.component';
import { PlaceholderDirective } from '../shared/placeholder directive/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error:string;

  closeSub:Subscription;
  
  @ViewChild(PlaceholderDirective) alertHost:PlaceholderDirective; //can pass a type to viewchild which finds the first occurence
                                                                  //of the type and returns it (here directive).

  constructor(
    private authService: AuthService, 
    private router:Router,
    private componentFactoryResolver:ComponentFactoryResolver) {}

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
        this.showErrorAlert(errorMessage)
        this.isLoading = false;
        console.log('Error Response:::', errorMessage);
      }
    );

    authForm.reset();
  }

  //component factory is used to create dynamic components manually (angular creates it) as opposed to *ngif where it is handled 
  //automatically and declaratively

  //Dynamic component loader is the concept (and a former helper utility) of creating and attaching components to DOM manually

  private showErrorAlert(message:string) { //creating components manually and passing data and destroying manually via 
  
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertModalComponent
    ) //this returns an alert component factory (component factory) which knows how to create an alert component

    //need a place to insert this component via viewcontainerref object which returns a reference/pointer to the place in DOM 
    // where component to be inserted as well as methods to add/insert a component in that place.

    // this is done via creating a directive with viewcontainerref injected in it, then the directive is used in the template 
    //or DOM where we use viewchild to access the directive in code and then access the viewcontainerref.
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear(); //clear any rendered content at that reference if any
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory); 
    //^^inserted the comp factory which creates the component in that place. then stored the reference of the created component

    componentRef.instance.message=message; //instance gives access to the instance of component and its properties
    this.closeSub = componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear()
    }) //close property is an event property of alertcomponent we an subscribe to.
    //when backdrop or close is clicked then onClose() triggered which emits event which is listened here

  }

  onClose() {
    console.log("Error before:::",this.error)
    this.error = null;
    console.log("Error after:::",this.error)
  }

  ngOnDestroy(): void {
    if(this.closeSub) {
      this.closeSub.unsubscribe(); //removed subscription in case authcomponent gets removed
    }
  }
}
