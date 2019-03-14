import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SettingsService,
  SidebarService,
  SharedService
 } from './service.index';
import { MantablasLibreria } from './mantbasica.libreria';
import { MantbasicaService } from './mantbasica.service';
import { NetsolinService } from './netsolin.service';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    MantablasLibreria,
    MantbasicaService,
    NetsolinService

  ],
  declarations: []
})
export class ServiceModule { }
