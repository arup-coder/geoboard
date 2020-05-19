import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.scss']
})
export class BandComponent {

  @Input() color: string;

  constructor() { }

}
