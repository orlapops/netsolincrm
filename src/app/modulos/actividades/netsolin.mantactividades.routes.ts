import { RouterModule, Routes } from '@angular/router';


// import { varGlobales } from '../../shared/varGlobales';
// import { Netsmantactividadmmodal } from './mantactividadmodal.componet';
import { AddregactividadComponent } from './adicionar/add.actividad.component';
import { EditregactividadComponent } from './editar/edit.actividad.component';
import { VerregactividadComponent } from './ver/ver.actividad.component';
// import { ListmantactividadmodalComponent } from './listadomante/listamantactividad.modal.component';


const mantactividadRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'addregactividad/:varParam', component: AddregactividadComponent, data: { titulo: 'Adicionar actividad' }},
            { path: 'verregactividad/:varParam/:id', component: VerregactividadComponent, data: { titulo: 'Consultar actividad' }},
            { path: 'editregactividad/:varParam/:id', component: EditregactividadComponent, data: { titulo: 'Ediar actividad' }}, 
        
        ]
    }
];


export const MANTACTIVIDAD_ROUTES = RouterModule.forChild( mantactividadRoutes );
