import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public bands = [
    {
      color: '#79539d',
      disabled: false,
    },
    {
      color: '#fecf30',
      disabled: true,
    },
    {
      color: '#f59231',
      disabled: true,
    },
    {
      color: '#c4222c',
      disabled: true,
    },
    {
      color: '#65a44a',
      disabled: true,
    },
    {
      color: '#189dc3',
      disabled: true,
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
