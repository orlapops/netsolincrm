//Op marzo 7 18
//Modelo de modulo principal de proyecto angular netsolin
//cambiar palabra modelo por identificardor del proeycto
//Incluir otros modulos si faltan
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRM_ROUTES } from './crm.routes';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

//firebase Agosto 30 18 prueba
// import { AngularFireModule } from 'angularfire2';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
//firebase prueba oct 4 18
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';

// ng2-charts
// import { ChartsModule } from 'ng2-charts';

import { CrmComponent } from './crm.component';

import { MonitorPrinCrmComponent } from './monitores/monitorprincrm.component';
import { NetsolinLibreriasModule } from '../../netsolinlibrerias/netsolin.librerias.module';
import { NetsolinMantablasModule } from '../../mantablasbasicas/netsolin.mantablas.module';
// import { TiendaModule } from '../tienda/tienda.module';
import { EditregcliepotenComponent } from './mantablasbasicas/clientepotencial/editar/editar.component';
import { VerregcliepotenComponent } from './mantablasbasicas/clientepotencial/ver/ver.component';
import { AddregcuentaComponent } from './mantablasbasicas/cuentacrm/adicionar/adicionar.component';
import { EditregcuentaComponent } from './mantablasbasicas/cuentacrm/editar/editar.component';
import { VerregcuentaComponent } from './mantablasbasicas/cuentacrm/ver/ver.component';
import { MantcotizacionComponent } from './documentos/cotizacion/mantcotiza.component';
import { AddregdprodcotizaComponent } from './documentos/cotizacion/dproductos/adicionar/adproductos.cotiza.component';
import { EditregdprodcotizaComponent } from './documentos/cotizacion/dproductos/editar/edproductos.cotiza.component';
import { VerregdprodcotizaComponent } from './documentos/cotizacion/dproductos/ver/vdproductos.cotiza.component';
import { ListmantdcotizamodalComponent } from './documentos/cotizacion/dproductos/listadomante/listamantdcotiza.modal.component';
import { Netsmantcotizadprodcrmmodal } from './documentos/cotizacion/dproductos/mantcotizadprodmodal.componet';
import { MonitorcuentaComponent } from './monitores/cuentacrm/monitor.component';
import { MonitorproductofcComponent } from './monitores/prodfcatalogo/monitor.component';
import { MonitorReferenvenComponent } from './monitores/referenven/monitor.component';

import { Netsmantcliepotenmodal } from './mantablasbasicas/clientepotencial/netsmantcliepotenmodal.componet';
import { Netsmantcuentacrmmodal } from './mantablasbasicas/cuentacrm/netsmantcuentacrmmodal.componet';
import { AddregcliepotenComponent } from './mantablasbasicas/clientepotencial/adicionar/adicionar.component';
import { Netsllamadomantcrmcotizacion } from './documentos/cotizacion/llamadomantcotizacion.componet';
import { Netscrmbusqueda } from './componentes/crmbusqueda/crmbusquedamodal.componet';
import { MonitorclienpotenComponent } from './monitores/clienpotencrm/monitor.component';
import { MonitorVendedorComponent } from './monitores/vendedor/monitor.component';
import { MonitorGeneralComponent } from './monitores/general/monitor.component';
import { MonitorObjetotablaComponent } from './monitores/objetotabla/monitor.component';

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
import { AppmenuCrmComponent } from './componentes/appmenuizq/appmenu.component';

import { Netsmantcontactocrmmodal } from './mantablasbasicas/contactos/netsmantcontactoscrmmodal.componet';
import { AddregcontactoComponent } from './mantablasbasicas/contactos/adicionar/adicionar.component';
import { EditregcontactoComponent } from './mantablasbasicas/contactos/editar/editar.component';
import { VerregcontactoComponent } from './mantablasbasicas/contactos/ver/ver.component';

import { NetsmantFichateccrmmodal } from './mantablasbasicas/ficha_tecnica/netsmantfichateccrmmodal.componet';

import { AddregFichatecComponent } from './mantablasbasicas/ficha_tecnica/adicionar/adicionar.component';
import { EditregFichatecComponent } from './mantablasbasicas/ficha_tecnica/editar/editar.component';
import { VerregFichatecComponent } from './mantablasbasicas/ficha_tecnica/ver/ver.component';

import { NetsolinMantactividadesModule } from '../actividades/netsolin.mantactividades.module';
import { NetsolinMantarchivosadjModule } from '../archivosadj/netsolin.mantarchivosadj.module';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
        CrmComponent,
        Netscrmbusqueda,
        MonitorPrinCrmComponent,
        Netsmantcliepotenmodal,
        Netsmantcuentacrmmodal, 
        AddregcuentaComponent,
        EditregcuentaComponent,
        VerregcuentaComponent,
        Netsmantcontactocrmmodal, 
        AddregcontactoComponent,
        EditregcontactoComponent,
        VerregcontactoComponent,
        NetsmantFichateccrmmodal,
        AddregFichatecComponent,
        EditregFichatecComponent,
        VerregFichatecComponent,        
        AddregcliepotenComponent,   
        EditregcliepotenComponent,
        VerregcliepotenComponent,
        MantcotizacionComponent,
        AddregdprodcotizaComponent,
        EditregdprodcotizaComponent,
        VerregdprodcotizaComponent,
        ListmantdcotizamodalComponent,
        Netsmantcotizadprodcrmmodal,
        Netsllamadomantcrmcotizacion,
        MonitorcuentaComponent,
        MonitorproductofcComponent,
        MonitorReferenvenComponent,
        MonitorclienpotenComponent,
        MonitorVendedorComponent,
        MonitorGeneralComponent,
        MonitorObjetotablaComponent,
        AppmenuCrmComponent,
    ],
    exports: [
        MonitorPrinCrmComponent,
        Netscrmbusqueda,
        Netsmantcliepotenmodal,
        AddregcliepotenComponent,
        EditregcliepotenComponent,
        VerregcliepotenComponent,
        AddregcuentaComponent,
        EditregcuentaComponent,
        VerregcuentaComponent,
        Netsmantcontactocrmmodal, 
        AddregcontactoComponent,
        EditregcontactoComponent,
        VerregcontactoComponent,
        NetsmantFichateccrmmodal,
        AddregFichatecComponent,
        EditregFichatecComponent,
        VerregFichatecComponent,        
        MantcotizacionComponent,
        AddregdprodcotizaComponent,
        EditregdprodcotizaComponent,
        VerregdprodcotizaComponent,
        ListmantdcotizamodalComponent,
        Netsmantcotizadprodcrmmodal,
        Netsllamadomantcrmcotizacion,
        MonitorcuentaComponent,
        MonitorproductofcComponent,
        MonitorReferenvenComponent,
        MonitorclienpotenComponent,
        MonitorVendedorComponent,
        MonitorGeneralComponent,
        MonitorObjetotablaComponent,
        AppmenuCrmComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        // TiendaModule,
        NetsolinLibreriasModule,
        CRM_ROUTES,
        FormsModule,
        ReactiveFormsModule,
        NetsolinMantablasModule,
        NetsolinMantactividadesModule,
        NetsolinMantarchivosadjModule,
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
        // AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features

        
        // ChartsModule
    ]
})
export class CrmModule { }
