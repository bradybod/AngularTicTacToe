import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cell',
  template: `
    <button *ngIf="!value" mat-raised-button color="primary" disableRipple>{{value}}</button>
    <button *ngIf="value == 'X'" mat-raised-button color="accent" disableRipple>{{value}}</button>
    <button *ngIf="value == 'O'" mat-raised-button color="warn" disableRipple>{{value}}</button>

  `,
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  @Input() value: 'X' | 'O';
}
