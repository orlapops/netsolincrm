//Op marzo 7 18
//Modelo de modulo principal de proyecto angular netsolin
//cambiar palabra modelo por identificardor del proeycto
//Incluir otros modulos si faltan
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TIENDA_ROUTES } from '../tienda/tienda.routes';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TiendaComponent } from './tienda.component';
import { NetsolinMantablasModule } from '../../mantablasbasicas/netsolin.mantablas.module';

import { SharedModule } from '../../shared/shared.module';

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
import { GridModule,ExcelModule  } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ChartsModule } from '@progress/kendo-angular-charts';

import '@progress/kendo-angular-intl/locales/es/all';
import { AppmenuTiendaComponent } from './componentes/appmenuizq/appmenu.component';
import { Netscategoriamodal } from '../tienda/categoria/netscategoriamodal.component';
import { Netssubcategomodal } from '../tienda/subcategoria/netssubcategomodal.component';
import { Netsproductosmodal } from '../tienda/productos/netsproductosmodal.component';

import { AddregCategoriaComponent } from '../tienda/categoria/adicionar/adicionar.component';
import { EditregCategoriaComponent } from '../tienda/categoria/editar/editar.component';
import { VerregCategoriaComponent } from '../tienda/categoria/ver/ver.component';

import { AddregSubcategoComponent } from '../tienda/subcategoria/adicionar/adicionar.component';
import { EditregSubcategoComponent } from '../tienda/subcategoria/editar/editar.component';
import { VerregSubcategoComponent } from '../tienda/subcategoria/ver/ver.component';

import { AddregProductosComponent } from '../tienda/productos/adicionar/adicionar.component';
import { EditregProductosComponent } from '../tienda/productos/editar/editar.component';
import { VerregProductosComponent } from '../tienda/productos/ver/ver.component';


import { NetsolinLibreriasModule } from '../../netsolinlibrerias/netsolin.librerias.module';


@NgModule({
    declarations: [
        TiendaComponent,
        Netscategoriamodal,
        Netssubcategomodal,
        Netsproductosmodal,
        
        AddregCategoriaComponent,
        EditregCategoriaComponent,
        VerregCategoriaComponent,

        AddregSubcategoComponent,
        EditregSubcategoComponent,
        VerregSubcategoComponent, 

        AddregProductosComponent,
        EditregProductosComponent,
        VerregProductosComponent, 

        AppmenuTiendaComponent,
    ],
    exports: [
        AddregCategoriaComponent,
        EditregCategoriaComponent,
        VerregCategoriaComponent, 
        
        AddregSubcategoComponent,
        EditregSubcategoComponent,
        VerregSubcategoComponent, 

        AddregProductosComponent,
        EditregProductosComponent,
        VerregProductosComponent, 

        AppmenuTiendaComponent,

    ],
    imports: [
        CommonModule,
        SharedModule,
        NetsolinLibreriasModule,
        TIENDA_ROUTES,
        FormsModule,
        ReactiveFormsModule,
        NetsolinMantablasModule,
        RouterModule,
        CommonModule,
        FormsModule,
        BrowserModule, 
        BrowserAnimationsModule, 
        NoopAnimationsModule,
        InputsModule,
        DropDownsModule,
        ReactiveFormsModule,    
        ButtonsModule,
        DropDownsModule,
        AutoCompleteModule,    
        ComboBoxModule,
        DialogModule,
        LayoutModule,
        GridModule,
        ExcelModule,
        ChartsModule,

        
        // ChartsModule
    ]
})
export class TiendaModule { }
