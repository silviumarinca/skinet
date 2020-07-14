import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPagination } from './models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'SkiNet';
  products: IPagination;
/**
 *
 */
constructor(private http: HttpClient) { }
 ngOnInit(): void {
    this.http.get('https://localhost:5001/api/products?pageSize=50').subscribe(
      ( response: IPagination ) => {this.products = response; }, err => console.log(err));
  }
}
