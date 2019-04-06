import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter,ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RowClassArgs } from '@progress/kendo-angular-grid';

import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { process, State } from '@progress/kendo-data-query';
import {
    GridComponent,
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

import { NetsolinApp } from '../../../shared/global';
import { MantbasicaService } from '../../../services/mantbasica.service';
import { NetsolinService } from '../../../services/netsolin.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'app-listmantarchivosadj',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './listamantarchivosadj.modal.component.html',
    styleUrls: ['./listamantarchivosadj.modal.component.css']
})
export class ListmantarchivosadjmodalComponent implements OnInit {
    @Input() ptablab: string;
    @Input() paplica: string;
    @Input() porden: string;
    @Input() title: string;
    @Input() objeto: string;
    @Input() rutamant: string;
    @Input() filtro: string;
    @Input() cod_doca: string;
    @Input() num_doca: string;
    @Input() id_cliepote: string;
    @Input() id_cuentacrm: string;    
    @Input() prefopermant: string;
  //Modulo asociado a la archivosadj 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
  @Input() modulo_asoc: number;
  //id del modulo al que se asocia la archivosadj
  @Input() id_modasoc: number;
    
    @Output() pasarDatos = new EventEmitter();

    linkaddarchivo: string="";
    pcampollave: string = "";
    pcamponombre: string = "";
    pclase_nbs: string = "";
    pclase_val: string = "";
    camposv: any[] = [];
    cargoConfig = false;
    aregstabla: any[] = [];
    cargando = true;
    resultados = false;
    noresultados = false;
    enlistaerror = false;
    listaerrores: any[] = [];
    campoBusqueda: FormControl;
    busqueda: string = '';
    enerror = false;
    eliminoreg = false;
    gridCcodigo = 'codigo';
    gridCnombre = 'nombre';
    muestraverant = false;
    varidreg: any;
    refrescando = false;
    linkbasearch:string = "";
    // Do not initially show the Dialog
    public opened: boolean = false;
    segper_consultar = false;
    segper_adicionar = false;
    segper_modificar = false;
    segper_eliminar = false;
    public confirmado;
    public crearregistro = false;
    public consultarregistro = false;
    public editarregistro = false;
    public state: State = {
        skip: 0,
        take: 20
    };
    // public pageSize = 10;
    // public skip = 0;
    // public gridView: GridDataResult;
    public gridData: GridDataResult;

    // private data: Object[];
    // private items: any[];
    public multiple = false;
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
        field: 'cod_tercer',
        dir: 'asc'
    }];
    //nombre variable con parametros de tabla para pasar a adicion,mod,ver
    varparcaptura = "VPAR" + this.ptablab;

    constructor(private location: Location,
        private mantbasicaService: MantbasicaService,
        private service: NetsolinService,
        private sanitizer: DomSanitizer,
        private httpc: HttpClient, private router: Router) {
        this.confirmado = null;
        // console.log("constructor listar.comp");
        // this.loadItems();

    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.aregstabla, this.state);
    }

    ngOnInit() {
//Inicializa llamado adicion archivo
        console.log('ngOnInit lista archivos linkaddarchivo');
        this.linkaddarchivo='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=CRMADDARCHIVOMOD&VCAMPO=USUARIO&VCONDI=Inicia&VTEXTO=';
        // console.log(this.linkaddarchivo);
        // this.linkaddarchivo+='PVXICOD_DOCUME='+      
        this.linkaddarchivo+='pvximodulo_asoc='+this.modulo_asoc.toString()+',pvxiid_modasoc='+this.id_modasoc.toString();
        console.log(this.linkaddarchivo);
        // console.log('this.id_cliepote:'+this.id_cliepote);
        // console.log('this.id_cuentacrm:'+this.id_cuentacrm);
        // this.linkaddarchivo+=',pvxiid_cliepote='+this.id_cliepote.toString()+',pvxiid_cuentacrm='+this.id_cuentacrm.toString();
        if (this.id_cliepote=='undefined')
            this.id_cliepote='0';
        if (this.id_cuentacrm=='undefined')
            this.id_cuentacrm='0';
        this.linkaddarchivo+=',pvxiid_cliepote='+this.id_cliepote+',pvxiid_cuentacrm='+this.id_cuentacrm;
        // console.log(this.linkaddarchivo);
        this.linkaddarchivo+=",pvxicod_doca='"+this.cod_doca+"',pvxinum_doca='"+this.num_doca+"'";
        this.linkaddarchivo=this.linkaddarchivo.replace('undefined','0');
        // console.log(this.linkaddarchivo);
        this.linkaddarchivo+='","Home","500px","100%",false)';
        console.log(this.linkaddarchivo);
        console.log(':'+this.modulo_asoc.toString()+':')
        switch(this.modulo_asoc.toString()) {
            case '1':
                this.linkbasearch='./archivos/docs/contactos/';
                break;
            case '2':
                this.linkbasearch='./archivos/docs/cliepoten/';
                break;
            case '3':
                this.linkbasearch='./archivos/docs/cuentas/';
                break;
            case '4':
                this.linkbasearch='./archivos/docs/cotizaciones/';
                break;
            case '5':
                this.linkbasearch='./archivos/docs/pedidos/';
                break;
            case '6':
                this.linkbasearch='./archivos/docs/campanas/';
                break;
            case '7':
                this.linkbasearch='./archivos/docs/servicios/';
                break;
            case '8':
                this.linkbasearch='./archivos/docs/fichatec/';
                break;
            default:
            this.linkbasearch='./archivos/docs/otros/';
            break;
    }
        
        console.log('this.linkbasearch:' , this.linkbasearch);
        // "'"+"FV1"+"',PVXINUM_DOCUME="+"'"+"    3054"+"'"+'","Home","500px","100%",false)';

        // console.log("ngOnInit listar.comp prod");
        //INICIALIZAR en blanco tabla de trabajo
        localStorage.setItem('NETMTABLA', "");
        this.resultados = false;
        this.campoBusqueda = new FormControl();
        // se debe asegurar que se ha leido archivo con url o fallara el servicio
        this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
            NetsolinApp.urlNetsolin = data['url_netsolins'];
            //carga por servicio diccionario de tabla y lo guarda en localstorage
            // console.log("ngOnInit listar.comp 2 prod");
            this.loaddiccionarios();
        });
    }

    public editClick({ dataItem, rowIndex, columnIndex }: any): void {
        // var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        var vpref = this.prefopermant; 
        var pruta = '/editregt' + vpref + '/' + this.varparcaptura;
        // console.log("pruta:" + pruta);
        // console.log("pvalc:" + pvalc);
        var pvalc = this.retornaValcampo(dataItem, 'C');
        // console.log("pvalc:" + pvalc);
        this.router.navigate([pruta, pvalc]);

    }

    public verRegK(dataItem): void {

        // var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        var vpref = this.prefopermant; 
        var pruta = '/verregt' + vpref + '/' + this.varparcaptura;
        // console.log("pruta:" + pruta);
        // console.log("pvalc:"+pvalc);
        // var pvalc= this.retornaValcampo(this.gridData.data[rowIndex],'C');
        var pvalc = this.retornaValcampo(dataItem, 'C');
        // console.log("pvalc:" + pvalc);
        this.router.navigate([pruta, pvalc]);
    }



    public onCancel(e, ditem): void {
        // console.log("en onCancel");
        // console.log(e);
        // console.log(ditem);

        // e.preventDefault();
        // this.closeForm();
    }
    ngOnChanges() {
        // console.log("ngOnChanges listar.comp productos");    
        // console.log(this.ptablab);
        // console.log(this.title);
        let ltabltrab = localStorage.getItem("NETMTABLA");
        //si es diferente de la que llega disparar carga diccionarios
        // console.log("tabla en localstorage: "+ltabltrab);
        // console.log("tabla que viene:"+this.ptablab);
        if (ltabltrab != this.ptablab) {
            // console.log('debe cargar nueva tabla');
            this.resultados = false;
            this.cargando = true;
            this.campoBusqueda = new FormControl();
            //traer ultima busqueda
            // console.log("ruta: "+this.rutamant);
            var lvbus: any;
            lvbus = localStorage.getItem('B' + this.rutamant);
            if (typeof (lvbus) == 'string') {
                this.busqueda = lvbus;
            } else {
                this.busqueda = '';
            }
            this.loaddiccionarios();
        } else {
            // console.log(" a buscar por tabla igual this.filtro: "+this.filtro);
            this.searchTbasica(this.filtro);
        }
    }

    ngDoCheck() {
        // console.log("ngDoCheck listar.comp");    
    }
    ngAfterContentInit() {
        // console.log("ngAfterContentInit listar.comp");    
    }
    ngAfterContentChecked() {
        // console.log("ngAfterContentChecked listar.comp");    
    }
    ngAfterViewInit() {
        // console.log("ngAfterViewInit listar.comp");    
    }

    ngAfterViewChecked() {
        // console.log("ngAfterViewChecked listar.comp");    
    }
    ngOnDestroy() {
        // console.log("ngOnDestroy listar.comp");    
    }

    searchTbasica(filtro) {
        console.log("searchTbasica");
        console.log(filtro);
        this.enerror = false;
        this.busqueda = filtro;
        console.log("searchTbasica:"+this.busqueda);
        this.cargando = true;
        // console.log(typeof(this.busqueda));
        // if (this.busqueda.length !== 0 && !this.enlistaerror) {
        if (this.busqueda.length !== 0) {            
            this.ejeBusqueda();
        } else {
            this.aregstabla = [];
            // this.items = [];
            // this.loadItems();

            this.cargando = false;
            this.resultados = false;
        }
    }

    ejeBusqueda() {
        console.log("ejeBusqueda:" + this.busqueda);
        console.log("ejeBusqueda:" + this.ptablab);
        console.log("ejeBusqueda:" + this.paplica);
        console.log("ejeBusqueda:" + this.pcampollave);
        // console.log("ejeBusqueda:" + this.pclase_nbs);
        // console.log("ejeBusqueda:" + this.pclase_val);
        // console.log("ejeBusqueda:" + this.pcamponombre);
        // console.log("ejeBusqueda:" + this.porden);
        // console.log("ejeBusqueda:" + this.objeto);
        this.confirmado = null;
        this.cargando = true;
        this.enlistaerror = false;
        this.mantbasicaService.gettablaSearch(this.busqueda, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre, this.porden, this.objeto, "",NetsolinApp.objpartablabas.campos_lista)
            .subscribe(result => {
                console.log("eje busqueda result");
                console.log(result);
                var result0 = result[0];
                // console.log(result0);
                if (typeof (result.isCallbackError) != "undefined") {
                    this.cargando = false;
                    this.resultados = true;
                    this.aregstabla = [];
                    this.gridData = process(this.aregstabla, this.state);
                    // this.enlistaerror = true;
                    // this.listaerrores = result.messages;
                    // console.log('Lista errores');
                    // console.log(this.listaerrores);
                    this.busqueda = '';
                    // this.enlistaerror=false;
                    localStorage.setItem('B' + this.rutamant, this.busqueda);
                }
                else {
                    this.aregstabla = result;
                    //   console.log(this.aregstabla);
                    //   console.log("Arreglo camposv:");
                    //   console.log(this.camposv);

                    // this.items = result;
                    // this.loadItems();
                    this.gridData = process(this.aregstabla, this.state);
                    localStorage.setItem('B' + this.rutamant, this.busqueda);
                    // console.log(this.aregstabla);
                    this.cargando = false;
                    this.resultados = true;
                    // console.log('pasando datos');
                    this.pasarDatos.emit({regdeta: this.aregstabla});
                    this.refrescando =false;
                    this.message = "Resultado para busqueda de: " + this.busqueda;
                }
            }, error => {
                //   console.log('Error en ejeBusqueda');
                // console.log(error);
                this.cargando = false;
                this.resultados = false;
                this.showError(error);
            });
    }


    borrarConfrma(rindex) {
        this.confirmado = rindex;
    }

    cancelarConfirma(rindex) {
        //  console.log("en cancelarConfirma");
        // console.log(rindex);
        this.confirmado = null;

    }



    // onDeleteTabla(regtabla, id) {
    onDeleteTabla(dataItem) {
        this.confirmado = null;
        console.log("en onDeleteTabla");
        console.log(dataItem, id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val);
        // console.log(this.aregstabla);    
        // console.log(this.aregstabla[rowIndex]);    
        var id = this.retornaValcampo(dataItem, 'C');
        // console.log("pvalc:" + id);
        this.mantbasicaService.deleteTabla(dataItem, id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val)
            .subscribe(newpro => {
                var result0 = newpro[0];
                // console.log('ondeletetable');
                // console.log(newpro);
                // console.log(result0);
                if (typeof (newpro.isCallbackError) != "undefined") {
                    this.eliminoreg = false;
                    this.enlistaerror = true;
                    this.listaerrores = newpro.messages;
                } else {
                    this.eliminoreg = true;
                    this.enlistaerror = false;
                    this.opened = true;
                    this.showMensaje('Se elimino el registro.');
                    this.ejeBusqueda();
                    // this.router.navigate(['/' + this.rutamant]);
                }

            }, error => {
                this.showError(error);
            })
    }

    retornaValcampo(pregistro, ptipo) {
        // console.log("retornavalcampo");
        // console.log(pregistro);

        if (ptipo == 'C') {
            var acllave = this.pcampollave.split(',');
            // console.log(acllave);
            //solo tener encuenta 2 para armar condicion 
            var lenallave = acllave.length;
            let lcadeval = '';
            if (acllave.length > 1) {
                var condi = '';
                lcadeval = "pregistro." + acllave[0] + "+'|'+pregistro." + acllave[1];
            } else {
                lcadeval = "pregistro." + this.pcampollave;
            }
            // console.log("retornavalcampo");
            // console.log(lcadeval);
            let valretorna = eval(lcadeval);
            // console.log("valretorna");
            // console.log(valretorna);
            return valretorna;

        } else {
            let lcadeval = "pregistro." + this.pcamponombre;
            // console.log(lcadeval);
            let valretorna = eval(lcadeval)
            return valretorna;
        }

    }


    retornaRuta(ptipo: string) {
        // console.log('Retorna ruta '+ptipo+' '+this.prefopermant);
        // var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        var vpref = this.prefopermant; 
        // console.log('vpref: '+vpref);    
        if (ptipo == 'A') {
            return '/addregt' + vpref;
        } else if (ptipo == 'V') {
            return '/verregt' + vpref + '/' + this.varparcaptura;
        } else {
            return '/editregt' + vpref + '/' + this.varparcaptura;
        }
    }
    /*
    retornaRuta(){
        return '/verregtbasica';
    }
    */

    verRef(event) {
        // console.log(event);
    }

    onSelect(ciudad) {
        this.router.navigate(['/editciudad', ciudad.cod_ciudad]);
    }

    message = "";
    // message = new MensajeError;

    showError(msg) {
        this.message = msg.message;
        this.enerror = true;
        // console.log(this.message);
    }

    showMensaje(msg) {
        this.message = msg;
        this.enerror = false;
        // console.log(this.message);
    }

    loaddiccionarios() {
        // console.log("loaddiccionarios listar.comp");
        /**
         * Carga tablapara captura de datos diccionarios netsolin incluya las que van el el modulo
         * 
         */
        // console.log("loaddicionarios");
        // console.log("this.ptablab;"+this.ptablab);
        // console.log("this.paplica;"+this.paplica);
        // console.log("this.objeto;"+this.objeto);
        this.service.getNetsolinObjmantbasica(this.objeto)
            .subscribe(result => {
                console.log("getNetsolinObjmantbasica 1");
                console.log(result);
                var result0 = result[0];
                // console.log(result0);
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
                NetsolinApp.objpartablabas.objeto = this.objeto;
                // { path: 'verregdcotiza/:varParam/:pidcotiza:/pid_dcotiza', component: VerregdprodcotizaComponent, canActivate: [GuardService]}, 

                NetsolinApp.objpartablabas.rutamant = "cotizacion/" + this.objeto;
                NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
                this.pcampollave = NetsolinApp.objpartablabas.campollave;
                this.pcamponombre = NetsolinApp.objpartablabas.camponombre;
                this.pclase_nbs = NetsolinApp.objpartablabas.clase_nbs;
                this.pclase_val = NetsolinApp.objpartablabas.clase_val;
                this.prefopermant = NetsolinApp.objpartablabas.prefopermant;
                // console.log("getNetsolinObjmantbasica luego de cargar objeto");

                if (result0.campos_lista.length > 2) {
                    // console.log("getNetsolinObjmantbasica luego de cargar objeto 1");
                    let var3 = JSON.parse(result0.campos_lista);
                    if (typeof (var3) == 'object') {
                        // console.log("getNetsolinObjmantbasica luego de cargar objeto 2");
                        NetsolinApp.objpartablabas.campos_lista = var3;
                        this.camposv = var3;
                    } else {
                        NetsolinApp.objpartablabas.campos_lista = [];
                        this.enerror = true;
                        this.message = "Error. Debe definir en el objeto los campos a visualizar."
                // console.log("getNetsolinObjmantbasica luego de cargar objeto 3 ojo no tiene campos a mostrar");
                        
                    }
                } else {
                    this.enerror = true;
                    this.message = "Error. Debe definir en el objeto los campos a visualizar."
                // console.log("getNetsolinObjmantbasica luego de cargar objeto 4 ojo no tiene campos a mostrar");
                }
                let var1 = JSON.stringify(NetsolinApp.objpartablabas);
                localStorage.setItem("VPAR" + result0.tabla, var1);

                this.service.getNetsolinDictabla(this.ptablab, parseInt(this.paplica), this.objeto)
                    .subscribe(result => {
                        // console.log('getNetsolinDictabla result');
                        // console.log(result);
                        var result0 = result[0];
                        // console.log(result0);
                        if (typeof (result.isCallbackError) != "undefined") {
                            this.cargando = false;
                            this.resultados = true;
                            this.enlistaerror = true;
                            this.listaerrores = result.messages;
                            this.cargoConfig = false;
                            // console.log('Lista errores en loiadidcc');
                            // console.log(this.listaerrores);
                            return;
                        }
                        this.varparcaptura = "VPAR" + this.ptablab;
                        //crear objeto de parametros tabla
                        // NetsolinApp.objpartablabas.aplica = parseInt(this.paplica);
                        // NetsolinApp.objpartablabas.tabla = this.ptablab;
                        // NetsolinApp.objpartablabas.campollave = this.pcampollave;
                        // NetsolinApp.objpartablabas.clase_val = this.pclase_val;
                        // NetsolinApp.objpartablabas.clase_nbs = this.pclase_nbs;
                        // NetsolinApp.objpartablabas.campos_lista  = this.camposv;
                        // NetsolinApp.objpartablabas.camponombre = this.pcamponombre;
                        // NetsolinApp.objpartablabas.titulo = this.title;
                        // NetsolinApp.objpartablabas.subtitulo = this.subtitle;
                        // NetsolinApp.objpartablabas.objeto = this.objeto;
                        // NetsolinApp.objpartablabas.rutamant = this.rutamant;
                        // NetsolinApp.objpartablabas.prefopermant = this.prefopermant;
                        // let var1 = JSON.stringify(NetsolinApp.objpartablabas);
                        // localStorage.setItem(this.varparcaptura, var1);
                        // console.log('llega de getNetsolinDictabla');
                        // console.log(result);
                        // console.log("this.prefopermant");
                        // console.log(this.prefopermant);
                        // console.log("NetsolinApp.objpartablabas.prefopermant");
                        // console.log(NetsolinApp.objpartablabas.prefopermant);
                        let var2 = JSON.stringify(result);
                        // console.log('var2');
                        // console.log(var2);
                        // localStorage.setItem('DDT' + this.ptablab, result);
                        localStorage.setItem('DDT' + this.ptablab, var2);
                        //traer ultima busqueda
                        // console.log("ruta: "+this.rutamant);
                        // var lvbus: any;
                        // lvbus = localStorage.getItem('B' + this.rutamant);
                        // if (typeof (lvbus) == 'string') {
                        //     this.busqueda = lvbus;
                        // } else {
                        //     this.busqueda = '';
                        // }
                        // console.log("load diccionarios filtro: "+this.filtro);
                        this.busqueda = this.filtro;
                        // console.log("load diccionarios busqueda: "+this.busqueda);
                        this.service.getNetsolinSegObj(this.objeto)
                            .subscribe(result => {
                                // console.log('Seguridad result');
                                // console.log(result);
                                NetsolinApp.objseguridad.objeto = this.objeto;
                                NetsolinApp.objseguridad.per_consultar = result.per_consultar;
                                NetsolinApp.objseguridad.per_adicionar = result.per_adicionar;
                                NetsolinApp.objseguridad.per_modificar = result.per_modificar;
                                NetsolinApp.objseguridad.per_eliminar = result.per_eliminar;
                                this.segper_adicionar = result.per_adicionar;
                                this.segper_consultar = result.per_consultar;
                                this.segper_eliminar = result.per_eliminar;
                                this.segper_modificar = result.per_modificar;
                                // console.log('Seguridad');
                                // console.log(NetsolinApp.objseguridad);
                                // console.log(this.segper_consultar);
                                //indicar tabla de trabajo actual
                                localStorage.setItem('NETMTABLA', this.ptablab);
                                // console.log('Seguridad 1');
                                if (typeof(this.busqueda) != 'undefined' && this.busqueda.length !== 0) {
                                    // console.log('Seguridad 2');
                                    this.searchTbasica(this.filtro);
                                    //   this.ejeBusqueda();
                                } else {
                                    this.enerror = true;
                                    this.message = "Error cadena de busqueda o filtro no puede ser vacio.";
                                    // console.log('Seguridad 3 ojo error');
                                    this.cargando = false;
                                }

                                this.cargoConfig = true;

                            }, error => {
                                this.enerror = true;
                                this.cargoConfig = false;
                                console.log('error dic');
                                console.log(error);
                                localStorage.setItem('SOBJ' + this.ptablab, null);
                                this.showError(error);
                            });
                    }, error => {
                        console.log('error dic 1');
                        console.log(error);
                        this.enerror = true;
                        this.cargoConfig = false;
                        localStorage.setItem('DDT' + this.ptablab, null);
                        this.showError(error);
                    });
            }, error => {
                console.log('Error configurando objeto:' + this.objeto)
                console.log(error);
                this.cargoConfig = false;
                this.enerror = true;
                this.message = 'Error no se pudo cargar';
                this.cargando = false;
            });

    }
    //maneja el control para llamado adicion de tablas
    openadicion() {
        this.crearregistro = true;
    }
    //maneja el control para cerrar

    public closeadicion() {
        this.crearregistro = false;
    }

    openconsulta(dataItem) {
        this.varidreg = this.retornaValcampo(dataItem, 'C');
        this.consultarregistro = true;
    }
    //maneja el control para cerrar

    public closeconsulta() {
        this.consultarregistro = false;
    }

    openeditar(dataItem) {
        this.varidreg = this.retornaValcampo(dataItem, 'C');
        this.editarregistro = true;
    }
    //maneja el control para cerrar

    public closeeditar() {
        this.editarregistro = false;
    }

    public close() {
        this.eliminoreg = false;
    }

    public open() {
        this.eliminoreg = true;
    }
    public refrescar(event) {
        this.refrescando = true;
        this.searchTbasica(this.filtro);
    }
   public  retornaPrioridad(datoprioridad):string {
        // console.log('retornaprioridad datoprioridad:'+datoprioridad);
        var cRetorna:string="";
        switch(datoprioridad) { 
            case 'A': { 
                cRetorna='Alta';
               break; 
            } 
            case 'M': { 
                cRetorna='Media';
               break; 
            } 
            case 'B': { 
                cRetorna='Baja';
               break; 
            } 
            default: { 
                cRetorna='Baja';
               break; 
            } 
         } 

        return cRetorna;
    }
    retornaTipo(datotipo):string {
        // console.log('retornaprioridad datoprioridad:'+datotipo);
        var cRetorna:string="";
        switch(datotipo) { 
            case 'R': { 
                cRetorna='Seguimiento';
               break; 
            } 
            case 'T': { 
                cRetorna='Tarea';
               break; 
            } 
            case 'L': { 
                cRetorna='Llamada';
               break; 
            } 
            case 'E': { 
                cRetorna='Email';
               break; 
            } 
            case 'C': { 
                cRetorna='Cita';
               break; 
            } 
            case 'S': { 
                cRetorna='Servicio';
               break; 
            } 
            default: { 
                cRetorna='Seguimiento';
               break; 
            } 
         } 

        return cRetorna;
    }
    retornaEstado(datoestado):string {
        var cRetorna:string="";
        switch(datoestado) { 
            case 'A': { 
                cRetorna='Abierta';
               break; 
            } 
            case 'P': { 
                cRetorna='En procedo';
               break; 
            } 
            case 'C': { 
                cRetorna='Cerrada';
               break; 
            } 
            case 'E': { 
                cRetorna='Ejecutada';
               break; 
            } 
            default: { 
                cRetorna='Abierta';
               break; 
            } 
         } 
        return cRetorna;
    }
    cleanURL(oldURL: string) {
        return this.sanitizer.bypassSecurityTrustUrl(oldURL);
      }
    
    public rowCallback(context: RowClassArgs) {
        // console.log('En rowCallback');
        // console.log(context);
        var enAlarma = false;
        var hoy = new Date();
        // Comparamos solo las fechas => no las horas!!
        hoy.setHours(0,0,0,0);  // Lo iniciamos a 00:00 horas
        // console.log('hoy:'+hoy);
        // console.log(typeof(context.dataItem.fecha_ven));
        var feccompara = new Date(context.dataItem.fecha_ven);
        // console.log('feccompara1:'+feccompara);
        feccompara.setHours(0,0,0,0);
        // console.log('feccompara2:'+feccompara);
        if (context.dataItem.estado=='A' || context.dataItem.estado=='P'){
            if (hoy <= feccompara) {
            enAlarma = false;
        } else {
            enAlarma = true;
        }
           
        }
        // const isEven = context.index % 2 == 0;
        return {
            even: enAlarma,
            odd: !enAlarma
        };
    }
}
