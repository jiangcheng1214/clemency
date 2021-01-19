import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChineseComponent } from './chinese/chinese.component';
import { EnglishComponent } from './english/english.component';
import { EnglishTestComponent } from './english/english-test/english-test.component';
import { EnglishRecoverResultComponent } from './english/english-recover-result/english-recover-result.component';

const routes: Routes = [
  {
    path: 'en',
    component: EnglishComponent,
    children:[
      {
        path:'taketest',
        component: EnglishTestComponent,
      },
      {
        path:'recoverresult',
        component: EnglishRecoverResultComponent,
      },
      {
        path:'',
        redirectTo: '/en/taketest',
        pathMatch:'full'
      }
    ]
   },
  { path: 'ch-sim', component: ChineseComponent },
  { path: '', redirectTo: '/en/taketest', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
