import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/board',
    pathMatch: 'full'
  },
  {
    path: 'board',
    loadChildren: () => import('./geo-board/geo-board.module').then(m => m.GeoBoardModule),
  },
  {
    path: '**',
    redirectTo: '/board'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
