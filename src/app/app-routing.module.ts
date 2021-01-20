import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoverComponent } from './components/recover/recover.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ResultComponent } from './components/result/result.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {
    path: ':language/',
    component: MainComponent,
  },
  {
    path: ':language/recover',
    component: RecoverComponent,
  },
  {
    path: ':language/payment',
    component: PaymentComponent,
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
