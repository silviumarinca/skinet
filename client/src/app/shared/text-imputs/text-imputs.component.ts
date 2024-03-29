import { Component, OnInit, ViewChild, ElementRef, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-imputs',
  templateUrl: './text-imputs.component.html',
  styleUrls: ['./text-imputs.component.scss']
})
export class TextImputsComponent implements OnInit, ControlValueAccessor {

  @ViewChild('input',{static: true})
   input: ElementRef;
  @Input() type = 'text';
  @Input() label: string;


onChange($event) {

}
onTouch() {
}
  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
   this.onTouch = fn;
  }
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
   }

  ngOnInit(): void {
     const control = this.controlDir.control;
     const validators = control.validator ? [control.validator] : [];
     const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
     control.setValidators(validators);
     control.setAsyncValidators(asyncValidators);
     control.updateValueAndValidity();
    }


}
