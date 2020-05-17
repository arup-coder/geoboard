import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.scss']
})
export class BandComponent implements OnInit {

  @Input() color: string;
  @Input() disabled: boolean;

  constructor() { }

  ngOnInit() {
  }

}
