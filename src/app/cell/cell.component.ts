import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cell',
  template: `
    <button mat-raised-button color="primary" disableRipple>{{value}}</button>
  `,
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  @Input() value: 'X' | 'O';
}
