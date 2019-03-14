import { RouterModule, Routes } from '@angular/router';

import { TiendaComponent } from './tienda.component';
import { NopagesfoundComponent } from '../../shared/nopagesfound/nopagesfound.component';
import { MantBasicaComponent } from '../../mantablasbasicas/tbasica/mantbasica.component';
import { AddregtbasicaComponent } from '../../mantablasbasicas/tbasica/adicionar/adicionar.component';
import { VerregtbasicaComponent } from '../../mantablasbasicas/tbasica/ver/ver.component';
import { EditregtbasicaComponent } from '../../mantablasbasicas/tbasica/editar/editar.component';

import { MenuTbasComponent } from '../../mantablasbasicas/tbasica/menumtablas/menumtablas.component';

import { AddregCategoriaComponent } from './categoria/adicionar/adicionar.component';
import { EditregCategoriaComponent } from './categoria/editar/editar.component';
import { VerregCategoriaComponent } from './categoria/ver/ver.component';

import { AddregSubcategoComponent } from '../tienda/subcategoria/adicionar/adicionar.component';
import { EditregSubcategoComponent } from '../tienda/subcategoria/editar/editar.component';
import { VerregSubcategoComponent } from '../tienda/subcategoria/ver/ver.component';

import { AddregProductosComponent } from '../tienda/productos/adicionar/adicionar.component';
import { EditregProductosComponent } from '../tienda/productos/editar/editar.component';
import { VerregProductosComponent } from '../tienda/productos/ver/ver.component';

import { NetsolinLibreriasModule } from '../../netsolinlibrerias/netsolin.librerias.module';



//Op marzo 7 18 Modelo rutas del modulo principal
//cambiar palabra modelo
//Incluya las rutas hijas

const tiendaRoutes: Routes = [
    {
        path: '',
        component: TiendaComponent,
        children: [
       
            {path: 'home', component: MenuTbasComponent, data: { titulo: 'Menu Principal' }},
            {path: 'menutbas', component: MenuTbasComponent, data: { titulo: 'Menu Principal' }},
        
            { path: 'mantbasica/:objeto', component: MantBasicaComponent, data: { titulo: 'Mantenimiento' }},
            { path: 'addregtbasica/:varParam', component: AddregtbasicaComponent, data: { titulo: 'Adicionar registro' }},
            { path: 'verregtbasica/:varParam/:id', component: VerregtbasicaComponent, data: { titulo: 'Consultar registro' }},
            { path: 'editregtbasica/:varParam/:id', component: EditregtbasicaComponent, data: { titulo: 'Editar registro' }},

            { path: 'addregtcategoria/:varParam', component: AddregCategoriaComponent, data: { titulo: 'Adicionar Categoria' }},
            { path: 'editregtcategoria/:varParam/:id', component: EditregCategoriaComponent, data: { titulo: 'Editar Categoria' }},
            { path: 'verregtcategoria/:varParam/:id', component: VerregCategoriaComponent, data: { titulo: 'Ver Categoria' }},

            { path: 'addregtsubcatego/:varParam', component: AddregSubcategoComponent, data: { titulo: 'Adicionar SubCategoria' }},
            { path: 'editregtsubcatego/:varParam/:id', component: EditregSubcategoComponent, data: { titulo: 'Editar SubCategoria' }},
            { path: 'verregtsubcatego/:varParam/:id', component: VerregSubcategoComponent, data: { titulo: 'Ver SubCategoria' }},

            { path: 'addregtproductos/:varParam', component: AddregProductosComponent, data: { titulo: 'Adicionar Productos' }},
            { path: 'editregtproductos/:varParam/:id', component: EditregProductosComponent, data: { titulo: 'Editar Productos' }},
            { path: 'verregtproductos/:varParam/:id', component: VerregProductosComponent, data: { titulo: 'Ver Productos' }},

            { path: '**', component: NopagesfoundComponent }
        ]
    }
];


export const TIENDA_ROUTES = RouterModule.forChild(tiendaRoutes);
