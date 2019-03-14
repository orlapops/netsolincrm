import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

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
import { UploadModule } from '@progress/kendo-angular-upload';
import '@progress/kendo-angular-intl/locales/es/all';

import { SharedModule } from '../../shared/shared.module';

import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { varGlobales } from '../../shared/varGlobales';
import { NetsolinMantablasModule } from '../../mantablasbasicas/netsolin.mantablas.module';
import { Netsmantarchivosadjmmodal } from './mantarchivosadjmodal.componet';
import { AddregarchivosadjComponent } from './adicionar/add.archivosadj.component';
import { EditregarchivosadjComponent } from './editar/edit.archivosadj.component';
import { VerregarchivosadjComponent } from './ver/ver.archivosadj.component';
import { ListmantarchivosadjmodalComponent } from './listadomante/listamantarchivosadj.modal.component';
import { NetsolinLibreriasModule } from '../../netsolinlibrerias/netsolin.librerias.module';

import { MANTARCHIVOS_ROUTES } from './netsolin.mantarchivosadj.routes';
import { UploadInterceptor, AdjarchivoComponent } from './adjarchivo.componet';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        SharedModule,
        FormsModule,
        BrowserModule, BrowserAnimationsModule, DropDownsModule,
        NoopAnimationsModule,
        HttpClientModule,
        UploadModule,
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
        NetsolinMantablasModule,
        MANTARCHIVOS_ROUTES

    ],
    declarations: [
        AddregarchivosadjComponent,
        EditregarchivosadjComponent,
        ListmantarchivosadjmodalComponent,
        VerregarchivosadjComponent,
        Netsmantarchivosadjmmodal,
        AdjarchivoComponent
    ],
    exports: [
        AddregarchivosadjComponent,
        EditregarchivosadjComponent,
        ListmantarchivosadjmodalComponent,
        VerregarchivosadjComponent,
        Netsmantarchivosadjmmodal
    ],
    providers: [
        varGlobales,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UploadInterceptor,
            multi: true
          }
    ],

})
export class NetsolinMantarchivosadjModule { }
// const platform = platformBrowserDynamic();