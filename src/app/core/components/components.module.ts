import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { CasesService } from '../services/cases/cases.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ],
  providers: [
    CasesService
  ]
})
export class ComponentsModule { }
