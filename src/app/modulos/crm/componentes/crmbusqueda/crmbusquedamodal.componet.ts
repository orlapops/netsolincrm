// import { EventEmitter } from 'NodeJS';
import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NetsolinService } from '../../../../services/netsolin.service';
import { NetsolinApp } from '../../../../shared/global';

@Component({
    selector: 'crm-busqueda',
    templateUrl: './crmbusquedamodal.component.html',

})
export class Netscrmbusqueda implements OnInit {    
    @Input() ptitulo: string;
    @Output() evenclose = new EventEmitter();
    enerror = false;
    message = "";
    cargoConfig = false;
    cargando = true;
    varparcaptura = "VPAR";
    enlistaerror = false;
    listaerrores: any[] = [];
    filtrocuenta: string;
    filtrovendedor: string;
    tbuscuenta: string;
    mostrarlistacuentas = false;
    mostrarlistavendedor = false;
    filtrocliepoten: string;
    mostrarlistacliepoten = false;
    filtrocontacto: string;
    mostrarlistacontactos = false;
    filtrocotiza: string;
    mostrarlistacotizaciones = false;
    filtroprodfc: string;
    mostrarlistaprodfc = false;
    filtrorefven: string;
    mostrarlistarefven = false;
    busqueda = "";

    constructor(
        private service: NetsolinService
    ) {
    }

    ngOnInit() {
        // console.log('ngoninit netsadi modial');
        // console.log('titulo: '+this.ptitulo);
        // console.log('pvaparam: '+this.pvaparam);
        // console.log('pobjeto: '+this.pobjeto);
        this.cargando = false;
    }

    close() {
        // console.log('close vent cliente potencial');
        this.evenclose.emit(event);
    }
    lanzarbuscotiza(event) {
        // console.log("lanzarbuscuenta");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }
        if (cbus == '*') {
            this.filtrocotiza = cbus;
        } else {
                this.filtrocotiza = "num_dcotiz=" + cbus + " or t.cod_tercer like '%" + cbus + "%' or est_cap like '%" + cbus + "%'";
        }
        this.filtrocliepoten ="";
        this.filtrocontacto = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacuentas = false;
        this.mostrarlistacontactos = false;
        this.mostrarlistacliepoten = false;
        this.mostrarlistacotizaciones = true;
    }

    
    lanzarbuscuenta(event) {
        // console.log("lanzarbuscuenta");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        // console.log('lanzarbuscuenta cbus:');
        // console.log(cbus);
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }
        if (cbus == '*') {
            this.filtrocuenta = cbus;
        } else {
            if (cid > 0) {
                this.filtrocuenta = "id_cuentacrm=" + cbus + " or nombre like '%" + cbus + "%' or cod_tercer like '%" + cbus + "%'";
            } else {
                this.filtrocuenta = "nombre like '%" + cbus + "%' or cod_tercer like '%" + cbus + "%' ";
            }
        }
        // console.log('this.filtrocuenta: '+this.filtrocuenta);
        this.filtrocliepoten ="";
        this.filtrocontacto = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacuentas = true;
        this.mostrarlistacontactos = false;
        this.mostrarlistacliepoten = false;
        this.filtrocotiza = "";
        this.mostrarlistacotizaciones = false;
    }
    lanzarbusprodfcatal(event) {
        // console.log("lanzarbusprodfcatal");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }
        if (cbus == '*') {
            this.filtroprodfc = cbus;
        } else {
            if (cid > 0) {
                this.filtroprodfc = "id=" + cbus + " or nombre like '%" + cbus + "%' or cod_prod like '%" + cbus + "%'";
            } else {
                this.filtroprodfc = "nombre like '%" + cbus + "%' or cod_prod like '%" + cbus + "%' ";
            }
        }
        this.filtrocliepoten ="";
        this.filtrocontacto = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacuentas = false;;
        this.mostrarlistacontactos = false;
        this.mostrarlistacliepoten = false;
        this.filtrocotiza = "";
        this.filtrorefven = "";
        this.mostrarlistacotizaciones = false;
        this.mostrarlistaprodfc=true;
        this.mostrarlistarefven=false;
    }
    lanzarbusrefventas(event) {
        // console.log("lanzarbusrefventas");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }
        if (cbus == '*') {
            this.filtrorefven = cbus;
        } else {
                this.filtrorefven = "r.nombre like '%" + cbus + "%' or r.cod_refven like '%" + cbus + "%' ";
        }
        this.filtrocliepoten ="";
        this.filtrocontacto = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacuentas = true;
        this.mostrarlistacontactos = false;
        this.mostrarlistacliepoten = false;
        this.filtrocotiza = "";
        this.mostrarlistacotizaciones = false;
        this.mostrarlistaprodfc=false;
        this.mostrarlistarefven=true;

    }
    lanzarbusvendedor(event) {
        console.log("lanzarbusvendedor 1");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        console.log("lanzarbusvendedor 2");
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }
        if (cbus == '*') {
            console.log("lanzarbusvendedor 3");
            this.filtrovendedor = cbus;
        } else {
            console.log("lanzarbusvendedor 4");
            if (cid > 0) {
                console.log("lanzarbusvendedor 5");
                this.filtrovendedor = "cod_vended='" + cbus + "' or t.nombre like '%" + cbus + "%' or t.cod_tercer like '%" + cbus + "%'";
            } else {
                console.log("lanzarbusvendedor 6");
                this.filtrovendedor = "t.nombre like '%" + cbus + "%' or cod_vended like '%" + cbus + "%' ";
            }
        }
        console.log("lanzarbusvendedor 7");
        this.filtrocliepoten ="";
        this.filtrocontacto = "";
        this.filtrocuenta = "";
        this.mostrarlistavendedor = true;
        this.mostrarlistacuentas = false;
        this.mostrarlistacontactos = false;
        this.mostrarlistacliepoten = false;
        this.filtrocotiza = "";
        this.mostrarlistacotizaciones = false;
    }

    lanzarbuscliepoten(event) {
        // console.log("lanzarbuscliepoten");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }

        if (cbus == '*') {
            this.filtrocliepoten = cbus;
        } else {
            if (cid > 0) {
                this.filtrocliepoten = "p.id_cliepote=" + cid.toString() + " or nom_contac like '%" + cbus + "%' or ape_contac like '%" + cbus + "%' or nom_empre like '%" + cbus + "%'  or cod_cliepote like '%" + cbus + "%'";
            } else {
                this.filtrocliepoten = "nom_contac like '%" + cbus + "%' or ape_contac like '%" + cbus + "%' or nom_empre like '%" + cbus + "%'  or cod_cliepote like '%" + cbus + "%'";
            }
        }
        this.filtrocuenta ="";
        this.filtrocontacto = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacliepoten = true;
        this.mostrarlistacuentas = true;
        this.mostrarlistacontactos = false;
        this.filtrocotiza = "";
        this.mostrarlistacotizaciones = false;

    }
    lanzarbuscontacto(event) {
        // console.log("lanzarbuscontacto");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }

        if (cbus == '*') {
            this.filtrocontacto = cbus;
        } else {
            var cid = parseInt(cbus);
            if (cid > 0) {
                this.filtrocontacto = "id_contacto=" + cbus + " or nombres like '%" + cbus + "%' or apellidos like '%" + cbus + "%' or cod_contac like '%" + cbus + "%'";
            } else {
                this.filtrocontacto = "nombres like '%" + cbus + "%' or apellidos like '%" + cbus + "%' or cod_contac like '%" + cbus + "%'";
            }
        }
        this.filtrocuenta ="";
        this.filtrocliepoten = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacontactos = true;
        this.mostrarlistacuentas = false;
        this.mostrarlistacliepoten = false;
        this.filtrocotiza = "";
        this.mostrarlistacotizaciones = false;
    }

}

