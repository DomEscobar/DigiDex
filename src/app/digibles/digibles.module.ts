import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigiblesComponent } from './digibles.component';
import { RouterModule, Routes } from '@angular/router';
import { DigibleDetailComponent } from './digible-detail/digible-detail.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const routes: Routes = [
  {
    path: '',
    component: DigiblesComponent
  },
  {
    path: ':id',
    component: DigibleDetailComponent
  }
];

@NgModule({
  declarations: [
    DigiblesComponent,
    DigibleDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxSkeletonLoaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DigiblesModule { }
