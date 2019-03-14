// import { EventEmitter } from 'NodeJS';
import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NetsolinApp } from '../../../../shared/global';
import { NetsolinService } from '../../../../services/netsolin.service';

@Component({
    selector: 'mant-cotiza',
    template: `
          <div *ngIf="cargando" class="text-center" style="padding-top: 60px;">
          <!-- <img src="../../../../assets/spinner.gif"> -->
          <img src="assets/spinner.gif">
        </div>                
          <div class="alert alert-danger" *ngIf="enlistaerror">
            <ul>
              <li *ngFor="let regerror of listaerrores">
                {{regerror.menerror}}
              </li>
            </ul>
          </div>        
            <crm-mantcotizacion *ngIf="cargoConfig && ptipomant=='A'" 
                vparcaptura="{{pvaparam}}" 
                ptipomant="{{ptipomant}}" 
                pid="{{pid}}" 
                pidcliepote="{{pidcliepote}}"                 
                pidcuentacrm="{{pidcuentacrm}}" >
             </crm-mantcotizacion>

            <crm-mantcotizacion *ngIf="cargoConfig && ptipomant=='E'" 
                vparcaptura="{{pvaparam}}" 
                ptipomant="{{ptipomant}}" 
                pid="{{pid}}" 
                pidcliepote="{{pidcliepote}}"                 
                pidcuentacrm="{{pidcuentacrm}}" >
             </crm-mantcotizacion>
             <crm-mantcotizacion *ngIf="cargoConfig && ptipomant=='C'" 
                 vparcaptura="{{pvaparam}}" 
                 ptipomant="{{ptipomant}}" 
                 pid="{{pid}}" 
                 pidcliepote="{{pidcliepote}}"                 
                 pidcuentacrm="{{pidcuentacrm}}" >
             </crm-mantcotizacion>
  `
})
export class Netsllamadomantcrmcotizacion implements OnInit {
    @Input() ptitulo: string;
    @Input() pvaparam: string;
    @Input() pobjeto: string;
    @Input() ptipomant: string;
    @Input() pid: any;
    @Input() pidcliepote: any;
    @Input() pidcuentacrm: any;
    @Output() evenclose = new EventEmitter();
    enerror = false;
    message = "";
    cargoConfig = false;
    cargando = true;
    varparcaptura = "VPAR";
    enlistaerror = false;
    listaerrores: any[] = [];

    constructor(
        private service: NetsolinService, private router: Router
    ) {
    }

    ngOnInit() {
        // console.log('ngoninit llamado a cotiza');
        // console.log('titulo: '+this.ptitulo);
        // console.log('pvaparam: '+this.pvaparam);
        // console.log('pobjeto: '+this.pobjeto);
        this.cargando = true;
        this.inicializacpaturatabla(this.pobjeto);
    }

    close() {
        // console.log('close vent cliente potencial');
        this.evenclose.emit(event);
    }
    // carga diccionarios para cuando se llama mantenimiento desde otro que no venga por listado
    inicializacpaturatabla(objeto) {
        this.cargando = true;
        // console.log("inicializa llamado cotiza");
        this.service.getNetsolinObjmantbasica(objeto)
            .subscribe(result => {
                // console.log("inicializacpaturatabla 1");
                var result0 = result[0];
                if (typeof (result.isCallbackError) != "undefined") {
                    this.enlistaerror = true;
                    this.listaerrores = result.messages;
                    this.cargoConfig = false;
                    this.cargando = false;
                    return;
                }
                NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
                NetsolinApp.objpartablabas.tabla = result0.tabla;
                NetsolinApp.objpartablabas.campollave = result0.campollave;
                NetsolinApp.objpartablabas.clase_val = result0.clase_val;
                NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;
                NetsolinApp.objpartablabas.camponombre = result0.camponombre;
                NetsolinApp.objpartablabas.titulo = result0.title;
                NetsolinApp.objpartablabas.subtitulo = "";
                NetsolinApp.objpartablabas.objeto = objeto;
                NetsolinApp.objpartablabas.rutamant = "mantbasica/" + objeto;
                NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
                let var1 = JSON.stringify(NetsolinApp.objpartablabas);
                localStorage.setItem("VPAR" + NetsolinApp.objpartablabas.tabla, var1);
                // console.log("VPAR: "+'VPAR' + NetsolinApp.objpartablabas.tabla);
                // console.log("inicializacpaturatabla 2");
                // console.log(NetsolinApp.objpartablabas);
                this.service.getNetsolinDictabla(NetsolinApp.objpartablabas.tabla, parseInt(result0.aplica), objeto)
                    .subscribe(result => {
                        var result0 = result[0];
                        // console.log("inicializacpaturatabla 3");
                        // console.log(result0);
                        if (typeof (result.isCallbackError) != "undefined") {
                            this.enlistaerror = true;
                            console.log("error en carga dic cotiza");
                            console.log(result);
                            this.listaerrores = result.messages;
                            this.cargoConfig = false;
                            this.cargando = false;
                            return;
                        }
                        // console.log("result nicializacpaturatabla 3.1");
                        // console.log(result);
                        // console.log(result0);
                        let var2 = JSON.stringify(result);
                        localStorage.setItem('DDT' + NetsolinApp.objpartablabas.tabla, var2);
                        // console.log("ddt: "+'DDT' + NetsolinApp.objpartablabas.tabla);
                        // console.log("inicializacpaturatabla 4");
                        this.service.getNetsolinSegObj(objeto)
                            .subscribe(result => {
                                let vars = JSON.stringify(result);
                                localStorage.setItem('SOBJ' + objeto, vars);
                                // console.log("SOBJ: "+'SOBJ' + objeto);
                                if (!result.per_adicionar) {
                                    this.cargoConfig = false;
                                    this.enerror = true;
                                    this.message = 'Error. No tiene permisos para adcionar. Consulte con su administrador';
                                    this.cargando = false;
                                    return;
                                }
                                // console.log("inicializacpaturatabla 5");
                                this.cargoConfig = true;
                                //redireccionar cambiando la ruta
                                    // var pruta = '/cotizacion'+ '/' + this.varparcaptura+ '/' + this.pid+ '/' + this.pidcliepote+ '/' + this.pidcuentacrm+'/A';
                                    var pruta = '/cotizacion'+ '/VPARCOTIZACRM_C' ;
                                    console.log("ir a cotizacion:" + pruta);
                                    // console.log("pvalc:"+pvalc);
                                    // var pvalc= this.retornaValcampo(this.gridData.data[rowIndex],'C');
                                    // console.log("pvalc:" + pvalc);
                                    // this.router.navigate([pruta, pvalc]);
                                    this.router.navigate([pruta,this.pid,this.pidcliepote,this.pidcuentacrm,'A' ]);
                            
                                this.cargando = false;
                            }, error => {
                                this.cargoConfig = false;
                                this.enerror = true;
                                this.message = 'Error no se pudo cargar';
                                localStorage.setItem('SOBJ' + objeto, null);
                                this.cargando = false;
                            });
                    }, error => {
                        this.cargoConfig = false;
                        localStorage.setItem('DDT' + result0.tabla, null);
                        this.enerror = true;
                        this.message = 'Error no se pudo cargar';
                        this.cargando = false;
                    });
            }, error => {
                // console.log('Error configurando objeto:' + this.objeto)
                // console.log(error);
                this.cargoConfig = false;
                this.enerror = true;
                this.message = 'Error no se pudo cargar';
                this.cargando = false;
            });
        // this.cargando= false;
    }
}

