import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
baseUrl = environment.apiUrl;
validationErrors: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  get404Error() {
    this.http.get(this.baseUrl + 'products/42')
    .subscribe(response => {console.log(response)},
                         err => console.log(err));
  }
  get500Error() {
    this.http.get(this.baseUrl + 'buggy/servererror')
    .subscribe(response => {console.log(response)},
                         err => console.log(err));
 }
  get400Error() {
    this.http.get(this.baseUrl + 'buggy/badrequest')
       .subscribe(response => {console.log(response)},
                                err => console.log(err));
}
  get400ValidationError() {
                          this.http.get(this.baseUrl + 'products/five')
                             .subscribe(response => {console.log(response)},
                                                    err => { console.log(err);
                                                             this.validationErrors = err.errors;
                                                    }
                                       );
}
}
