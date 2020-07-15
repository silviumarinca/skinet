import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true })
  searchTerm: ElementRef;

products: IProduct[];
brands: IBrand[];
types: IType[];
shopParams = new ShopParams();
totalCount = 0;
sortOptions = [
  {name: 'Alphabetical', value: 'name'},
  {name: 'Price: Low To High', value: 'priceAsc'},
  {name: 'Price: Hign To Low', value: 'priceDesc'},
];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getTypes();
    this.getBrands();
  }
 getProducts() {
  this.shopService.getProducts(this.shopParams).subscribe(response => {
    this.products = response.data;
    this.shopParams.pageNumber = response.pageIndex;
    this.shopParams.pageSize = response.pageSize;
    this.totalCount = response.count;
  }, error => {console.log(error); });
 }

 getTypes() {
  this.shopService.getTypes().subscribe(response => {
    this.types = [{id: 0 , name : 'All'}, ...response];
  }, error => {console.log(error); });
}
getBrands() {
  this.shopService.getBrands().subscribe(response => {
    this.brands = [{id: 0 , name : 'All'}, ...response];
  }, error => {console.log(error); });
}
onBrandSelected(Id: number) {
  this.shopParams.brandId = Id;
  this.getProducts();
}
onTypeSelected(Id: number) {
  this.shopParams.typeId = Id;
  this.shopParams.pageNumber = 1;
  this.getProducts();
}
onSortSelected(sort: string) {
  this.shopParams.sort = sort;
  this.shopParams.pageNumber = 1;
  this.getProducts();

}
onPageChanged(event: any) {
  if (this.shopParams.pageNumber !== event){
  this.shopParams.pageNumber = event;
  this.getProducts();
  }
}
onSearch() {
  this.shopParams.search = this.searchTerm.nativeElement.value;
  this.shopParams.pageNumber = 1;
  this.getProducts();
}
onReset() {
  this.searchTerm.nativeElement.value = '';
  this.shopParams = new ShopParams();
  this.getProducts();
}
}
