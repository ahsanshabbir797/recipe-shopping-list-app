import { Component } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";

@Component({
    selector:'app-auth',
    templateUrl:'./auth.component.html',
    styleUrls:['./auth.component.css']
})
export class AuthComponent {
    isLoginMode = true;

    //Reactive form approach
    // auth = new FormGroup({
    //     'email': new FormControl("",[Validators.required,Validators.email]),
    //     'password': new FormControl("",[Validators.required])
    // });

    authForm = {
        email:'',
        password:''
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form:NgForm) {
        console.log("Auth Form:::",form.value);
        form.reset();
    };
}