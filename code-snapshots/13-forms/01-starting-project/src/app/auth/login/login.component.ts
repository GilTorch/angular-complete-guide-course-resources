import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

function mustContainQuestioMark(control: AbstractControl){
  if(control.value.includes("?")){
    return null
  }

  return { doesNotContainQuestionMark: true }
}
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule]
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), mustContainQuestioMark]
    })
  })


  isInvalid(field: "email" | "password"){
    return this.form.controls[field].touched && this.form.controls[field].dirty && this.form.controls[field].invalid
  }

  onSubmit(){
    const enteredEmail = this.form.controls.email;
    const enteredPassword = this.form.controls.password;
    console.log(enteredEmail, enteredPassword);
  }

}