import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Kendo
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
// Import the ButtonsModule
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// Imports the AutoComplete module
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
// Imports the ComboBox module
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';

import '@progress/kendo-angular-intl/locales/es/all';

import { SharedModule } from '../../shared/shared.module';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { varGlobales } from '../../shared/varGlobales';
import { Netsmantactividadmmodal } from './mantactividadmodal.componet';
import { AddregactividadComponent } from './adicionar/add.actividad.component';
import { EditregactividadComponent } from './editar/edit.actividad.component';
import { VerregactividadComponent } from './ver/ver.actividad.component';
import { ListmantactividadmodalComponent } from './listadomante/listamantactividad.modal.component';
import { NetsolinLibreriasModule } from '../../netsolinlibrerias/netsolin.librerias.module';

import { MANTACTIVIDAD_ROUTES } from './netsolin.mantactividades.routes';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        SharedModule,
        FormsModule,
        BrowserModule, BrowserAnimationsModule, DropDownsModule,
        NoopAnimationsModule,
        InputsModule,
        ReactiveFormsModule,    
        ButtonsModule,
        DropDownsModule,
        AutoCompleteModule,    
        ComboBoxModule,
        DialogModule,
        LayoutModule,
        GridModule,   
        NetsolinLibreriasModule,
        MANTACTIVIDAD_ROUTES

    ],
    declarations: [
        AddregactividadComponent,
        EditregactividadComponent,
        ListmantactividadmodalComponent,
        VerregactividadComponent,
        Netsmantactividadmmodal
    ],
    exports: [
        AddregactividadComponent,
        EditregactividadComponent,
        ListmantactividadmodalComponent,
        VerregactividadComponent,
        Netsmantactividadmmodal
    ],
    providers: [
        varGlobales
    ],

})
export class NetsolinMantactividadesModule { }
