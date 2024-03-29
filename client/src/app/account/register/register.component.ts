import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { timer, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
registerForm: FormGroup;
errors: string[];
  constructor(private router: Router, private fb: FormBuilder, private accountService: AccountService) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

   createRegisterForm(){
     this.registerForm = this.fb.group({
        displayName: [null,[Validators.required]],
        email: [ null, [ Validators.required,
                         Validators.pattern('[\\w-]+@([\\w-]+\\.)+[\\w-]+')],
                       [this.validateEmailNotTaken()]],
        password: [null, Validators.required]

     });
   }
   onSubmit(){
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/shop');
    }, err =>{ this.errors = err.errors});
   }

   validateEmailNotTaken(): AsyncValidatorFn {
     return control => {
       return timer(500)
              .pipe(switchMap(() => {
                                      if (!control.value) {  return of(null); }
                                      return this.accountService.checkEmailExists(control.value)
                                             .pipe(map(res => res ?  {emailExists: true} : null));
                                    }

                   ));
     };
   }


}
