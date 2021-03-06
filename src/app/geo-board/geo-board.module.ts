import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { GeoBoardRoutingModule } from './geo-board-routing.module';
import { BoardComponent } from './components/board/board.component';
import { PegComponent } from './components/peg/peg.component';
import { BandComponent } from './components/band/band.component';

@NgModule({
  declarations: [
    BoardComponent,
    PegComponent,
    BandComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    GeoBoardRoutingModule,
  ]
})
export class GeoBoardModule { }
