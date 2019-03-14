import { RouterModule, Routes } from '@angular/router';

import { CrmComponent } from './crm.component';
import { MonitorPrinCrmComponent } from './monitores/monitorprincrm.component';
import { NopagesfoundComponent } from '../../shared/nopagesfound/nopagesfound.component';


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
import { MonitorclienpotenComponent } from './monitores/clienpotencrm/monitor.component';
import { MonitorObjetotablaComponent } from './monitores/objetotabla/monitor.component';
import { MonitorVendedorComponent } from './monitores/vendedor/monitor.component';
import { MonitorGeneralComponent } from './monitores/general/monitor.component';
import { Netsmantcliepotenmodal } from './mantablasbasicas/clientepotencial/netsmantcliepotenmodal.componet';
import { Netsmantcuentacrmmodal } from './mantablasbasicas/cuentacrm/netsmantcuentacrmmodal.componet';
import { AddregcliepotenComponent } from './mantablasbasicas/clientepotencial/adicionar/adicionar.component';
import { Netsllamadomantcrmcotizacion } from './documentos/cotizacion/llamadomantcotizacion.componet';
import { Netscrmbusqueda } from './componentes/crmbusqueda/crmbusquedamodal.componet';
import { MantBasicaComponent } from '../../mantablasbasicas/tbasica/mantbasica.component';
import { AddregtbasicaComponent } from '../../mantablasbasicas/tbasica/adicionar/adicionar.component';
import { VerregtbasicaComponent } from '../../mantablasbasicas/tbasica/ver/ver.component';
import { EditregtbasicaComponent } from '../../mantablasbasicas/tbasica/editar/editar.component';
import { AddregterceroComponent } from '../../mantablasbasicas/terceros/adicionar/adicionar.component';
import { VerregterceroComponent } from '../../mantablasbasicas/terceros/ver/ver.component';
import { EditregterceroComponent } from '../../mantablasbasicas/terceros/editar/editar.component';
import { MenuTbasComponent } from '../../mantablasbasicas/tbasica/menumtablas/menumtablas.component';
import { AddregcontactoComponent } from './mantablasbasicas/contactos/adicionar/adicionar.component';
import { EditregcontactoComponent } from './mantablasbasicas/contactos/editar/editar.component';
import { VerregcontactoComponent } from './mantablasbasicas/contactos/ver/ver.component';
import { AddregFichatecComponent } from './mantablasbasicas/ficha_tecnica/adicionar/adicionar.component';
import { EditregFichatecComponent } from './mantablasbasicas/ficha_tecnica/editar/editar.component';
import { VerregFichatecComponent } from './mantablasbasicas/ficha_tecnica/ver/ver.component';


//Op marzo 7 18 Modelo rutas del modulo principal
//cambiar palabra modelo
//Incluya las rutas hijas

const crmRoutes: Routes = [
    {
        path: '',
        component: CrmComponent,
        children: [
            { path: 'home', component: MonitorPrinCrmComponent, data: { titulo: 'Monitor Principal' } },
            {path: 'menutbas', component: MenuTbasComponent, data: { titulo: 'Menu Principal' }},
            { path: 'monitorprincrm', component: MonitorPrinCrmComponent, data: { titulo: 'Monitor Principal' } },

            { path: 'mantbasica/:objeto', component: MantBasicaComponent, data: { titulo: 'Mantenimiento' }},
            { path: 'addregtbasica/:varParam', component: AddregtbasicaComponent, data: { titulo: 'Adicionar registro' }},
            { path: 'verregtbasica/:varParam/:id', component: VerregtbasicaComponent, data: { titulo: 'Consultar registro' }},
            { path: 'editregtbasica/:varParam/:id', component: EditregtbasicaComponent, data: { titulo: 'Editar registro' }},

            { path: 'addregttercero/:varParam/id_cliepoten', component: AddregterceroComponent, data: { titulo: 'Adicionar tercero' }},
            { path: 'verregttercero/:varParam/:id', component: VerregterceroComponent, data: { titulo: 'Consultar tercero' }},
            { path: 'editregttercero/:varParam/:id', component: EditregterceroComponent, data: { titulo: 'Ediar tercero' }}, 


            { path: 'addregtcliepoten/:varParam', component: AddregcliepotenComponent, data: { titulo: 'Adicionar Cliente potencial' }},
            { path: 'editregtcliepoten/:varParam/:id', component: EditregcliepotenComponent, data: { titulo: 'Editar Cliente potencial' }}, 
            { path: 'verregtcliepoten/:varParam/:id', component: VerregcliepotenComponent, data: { titulo: 'Consulta Cliente potencial' }}, 
        
            { path: 'addregtcuenta/:varParam', component: AddregcuentaComponent, data: { titulo: 'Adicionar cuenta' }},
            { path: 'editregtcuenta/:varParam/:id', component: EditregcuentaComponent, data: { titulo: 'Editar cuenta' }}, 
            { path: 'verregtcuenta/:varParam/:id', component: VerregcuentaComponent, data: { titulo: 'Consultar cuenta' }}, 
            { path: 'monitorcuenta/:varParam/:id', component: MonitorcuentaComponent, data: { titulo: 'Monitor Cuenta' }}, 
            { path: 'monitorcliepoten/:varParam/:id', component: MonitorclienpotenComponent, data: { titulo: 'Monitor Cuenta' }}, 
            { path: 'monitorvendedor/:varParam/:id', component: MonitorVendedorComponent, data: { titulo: 'Monitor Vendedor' }}, 
            { path: 'monitorgeneral', component: MonitorGeneralComponent, data: { titulo: 'Monitor General' }}, 
            { path: 'monitorobjtabla/:varParam/:id', component: MonitorObjetotablaComponent, data: { titulo: 'Monitor panel tabla' }}, 
            { path: 'monitorprodfcat/:varParam/:id', component: MonitorproductofcComponent, data: { titulo: 'Monitor Producto' }}, 
            { path: 'monitorreferenven/:varParam/:id', component: MonitorReferenvenComponent, data: { titulo: 'Monitor Referencia' }}, 
                       
            { path: 'addregtcontacto/:varParam', component: AddregcontactoComponent, data: { titulo: 'Adicionar contacto' }},
            { path: 'editregtcontacto/:varParam/:id', component: EditregcontactoComponent, data: { titulo: 'Editar contacto' }},
            { path: 'verregtcontacto/:varParam/:id', component: VerregcontactoComponent, data: { titulo: 'Ver contacto' }},

            { path: 'addregtfichatec/:varParam', component: AddregFichatecComponent, data: { titulo: 'Adicionar Ficha tecnica' }},
            { path: 'editregtfichatec/:varParam/:id', component: EditregFichatecComponent, data: { titulo: 'Editar Ficha tecnica' }},
            { path: 'verregtfichatec/:varParam/:id', component: VerregFichatecComponent, data: { titulo: 'Ver Ficha tecnica' }},
       
            { path: 'cotizacion/:varParam/:pid/:pidcliepote/:pidcuentacrm/:ptipomant/:pcod_dcotiz/:pnum_dcotiz', component: MantcotizacionComponent, data: { titulo: 'Cotización' }}, 
            { path: 'addregdcotiza/:varParam/:pidcotiza', component: AddregdprodcotizaComponent, data: { titulo: 'Adicionar producto cotización' }},
            { path: 'editregdcotiza/:varParam/:pidcotiza/:pid_dcotiza', component: EditregdprodcotizaComponent, data: { titulo: 'Editar producto cotización' }}, 
            { path: 'verregdcotiza/:varParam/:pidcotiza:/pid_dcotiza', component: VerregdprodcotizaComponent, data: { titulo: 'Consultar producto cotización' }}, 
            {path: '', redirectTo: '/home', pathMatch: 'full'},
            { path: '**', component: NopagesfoundComponent }
            // { path: '', redirectTo: '/monitorprincrm', pathMatch: 'full' }
        ]
    }
];


export const CRM_ROUTES = RouterModule.forChild( crmRoutes);
