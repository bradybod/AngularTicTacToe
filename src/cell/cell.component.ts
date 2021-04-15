import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cell',
  template: `
    <p>
      cell works!
    </p>
  `,
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
