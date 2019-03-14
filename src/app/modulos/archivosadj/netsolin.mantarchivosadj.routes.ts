import { RouterModule, Routes } from '@angular/router';


// import { varGlobales } from '../../shared/varGlobales';
// import { Netsmantarchivosadjmmodal } from './mantarchivosadjmodal.componet';
import { AddregarchivosadjComponent } from './adicionar/add.archivosadj.component';
import { EditregarchivosadjComponent } from './editar/edit.archivosadj.component';
import { VerregarchivosadjComponent } from './ver/ver.archivosadj.component';
// import { ListmantarchivosadjmodalComponent } from './listadomante/listamantarchivosadj.modal.component';


const mantarchivosadjRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'addregarchivosadj/:varParam', component: AddregarchivosadjComponent, data: { titulo: 'Adicionar Archivos' }},
            { path: 'verregarchivosadj/:varParam/:id', component: VerregarchivosadjComponent, data: { titulo: 'Consultar Archivos' }},
            { path: 'editregarchivosadj/:varParam/:id', component: EditregarchivosadjComponent, data: { titulo: 'Ediar Archivos' }}, 
        
        ]
    }
];


export const MANTARCHIVOS_ROUTES = RouterModule.forChild( mantarchivosadjRoutes );
