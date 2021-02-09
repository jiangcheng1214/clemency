import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoverComponent } from './components/recover/recover.component';
import { MainComponent } from './components/main/main.component';
import { ResultComponent } from './components/result/result.component';

const routes: Routes = [
  {
    path: ':language/',
    component: MainComponent,
  },
  {
    path: ':language',
    component: MainComponent,
  },
  {
    path: ':language/recover',
    component: RecoverComponent,
  },
  {
    path: ':language/result',
    component: ResultComponent,
  },
  { path: '', redirectTo: '/en/', pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
