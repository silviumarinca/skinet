import { Component, OnInit } from '@angular/core';
import {   FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

 loginForm: FormGroup;
 returnUrl: string;
  constructor(private accountService: AccountService, private router: Router , private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop';
  }
createLoginForm(){
  this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('[\\w-]+@([\\w-]+\\.)+[\\w-]+')]),
      password: new FormControl('', Validators.required)
  });
}
onSubmit(){
  this.accountService.login(this.loginForm.value)
  .subscribe(() => {
    this.router.navigateByUrl(this.returnUrl);
   }, err => {
     console.log(err);
    });
}
}
