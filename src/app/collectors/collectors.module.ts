import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectorsComponent } from './collectors/collectors.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


const routes: Routes = [
  {
    path: '',
    component: CollectorsComponent
  }
];


@NgModule({
  declarations: [
    CollectorsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxSkeletonLoaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CollectorsModule { }
