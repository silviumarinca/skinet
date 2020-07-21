import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {  ReplaySubject, of } from 'rxjs';
import { IUser } from '../shared/models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = environment.apiUrl;
private currentUserSource = new ReplaySubject<IUser>(1);
currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }
  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values)
    .pipe(map((u: IUser) => {
      if (u) {
        localStorage.setItem('token', u.token);
        this.currentUserSource.next(u);
      }
    }));
  }
  register(values: any){
    return this.http.post(this.baseUrl + 'account/register', values)
    .pipe(map((user: IUser) => {
      if (user) {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      }
    }));
  };
  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }
  checkEmailExists(email: string){
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  loadCurrentUser(token: string ) {

    if(token === null){
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl + 'account', { headers})
               .pipe(map( (user: IUser) => {
                            if (user) {
                              localStorage.setItem('token', user.token);
                              this.currentUserSource.next(user);
                            }
                          }));
  }
}
