import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { PanelBarExpandMode, PanelBarItemModel } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../shared/global';
import { MantbasicaService } from '../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../services/mantbasica.libreria';
import { varGlobales } from '../../../shared/varGlobales';
import { environment } from '../../../../environments/environment';

//Firebase Oct 4 18
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';

@Component({
  selector: 'app-monitorprincrm',
  templateUrl: './monitorprincrm.component.html',
  styleUrls: ['./monitorprincrm.component.css']
})
export class MonitorPrinCrmComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  title: string;
  subtitle = '(Monitor)';
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  crearcotiza = false;
  nom_empre: string;
  cargousuario = false;
  regUsuario: any;
  cargocontacto = false;
  regContacto: any;
  vvalocategoria: string;
  filtrocontacto: string;
  filtroactividades:string="";
  filtrocotiza:string="";
  id_terconsulta: string;s
  id_cliepoten: string;
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje=false;
  puedecrearcotizacion= false;
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;
  anofiltro = this.ano.toString().trim();
  mesfiltro = this.mes.toString().trim();

  pruebavininumbuscombog:string = "";
  llamabusqueda = false;
  pruellegallabusque:string="";
  public paramusuar: any = {titulo: "Usuario",cod_usuar :"",tipo:"T"}
  public paramocotizaganadas: any = {titulo: "Ganadas",cod_usuar :"",tipo:"G", numreg:20, ano:this.ano, mes: this.mes}
  public paramocotizacanceladas: any = {titulo: "Canceladas",cod_usuar :"",tipo:"C", numreg:10, ano:this.ano, mes: this.mes}
  public paramocotizaperdidas: any = {titulo: "Perdidas",cod_usuar :"",tipo:"P", numreg:20, ano:this.ano, mes: this.mes}
  public paramocotizaborrador: any = {titulo: "Borrador",cod_usuar :"",tipo:"B", numreg:20, ano:this.ano, mes: this.mes}
  public paramocotizaenproceso: any = {titulo: "En proceso",cod_usuar :"",tipo:"O", numreg:20, ano:this.ano, mes: this.mes}
  public paramactividadpenvenc: any = {titulo: "Pendientes vencidas",cod_usuar :"",tipo:"PV", numreg:30, ano:this.ano, mes: this.mes}
  public paramactividadpenxvenc: any = {titulo: "Pendientes x Vencer",cod_usuar :"",tipo:"PXV", numreg:20, ano:this.ano, mes: this.mes}
  public paramactividadtareas: any = {titulo: "Tareas",cod_usuar :"",tipo:"TAR", numreg:20, ano:this.ano, mes: this.mes}
  public paramactividadllamadas: any = {titulo: "Llamadas",cod_usuar :"",tipo:"LLA", numreg:20, ano:this.ano, mes: this.mes}
  public paramactividadsegui: any = {titulo: "Seguimientos",cod_usuar :"",tipo:"SEG", numreg:20, ano:this.ano, mes: this.mes}
  public paramactividademail: any = {titulo: "Llamadas",cod_usuar :"",tipo:"EMAIL", numreg:20, ano:this.ano, mes: this.mes}
  public paramactividadcitas: any = {titulo: "Citas",cod_usuar :"",tipo:"CITA", numreg:20, ano:this.ano, mes: this.mes}
  public paramactividadservi: any = {titulo: "Servicios",cod_usuar :"",tipo:"SERV", numreg:20, ano:this.ano, mes: this.mes}
  items: Observable<any[]>;
  public listanos: Array<number> = [];
  public listameses: any = [
       {mes: 1,nommes :"Enero"},
       {mes: 2,nommes :"Febrero"},
       {mes: 3,nommes :"Marzo"},
       {mes: 4,nommes :"Abril"},
       {mes: 5,nommes :"Mayo"},
       {mes: 6,nommes :"Junio"},
       {mes: 7,nommes :"Julio"},
       {mes: 8,nommes :"Agosto"},
       {mes: 9,nommes :"Septiembre"},
       {mes: 10,nommes :"Octubre"},
       {mes: 11,nommes :"Noviembre"},
       {mes: 12,nommes :"Diciembre"}
  ]
  Itemmes: {mes: 1,nommes :"Enero"};

//configuracion menu panelinfo
public itemsinfo: Array<PanelBarItemModel> = [
    <PanelBarItemModel> {title: "General", id:'infgen',selected:true },
    <PanelBarItemModel> {title: "Marketing", id:'infmark' },
    <PanelBarItemModel> {title: "Contacto Inicial", id:'infcontac' },
    <PanelBarItemModel> {title: "Contactos", id:'infcon' }
];
    
private selectedId: string = "";


  private baseImageUrl: string = "https://demos.telerik.com/kendo-ui/content/web/panelbar/";

  private imageUrl(imageName: string) :string {
      return this.baseImageUrl + imageName + ".jpg";
  }

  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    // db: AngularFirestore

  ) {
    this.vglobal.mostrarbreadcrumbs = false;
    //llenar array ultimos 5 años
    this.listanos.push(this.ano);
    this.listanos.push(this.ano-1);
    this.listanos.push(this.ano-2);
    this.listanos.push(this.ano-3);
    this.listanos.push(this.ano-4);
    // this.items = db.collection('categorias').valueChanges();
  }

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    // public onPanelChange(event: any) { 
    //console.log("onPanelChange: ", event); 
    //console.log("onPanelChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    //console.log("focusedEvent.id: "+focusedEvent.id);
    this.infopanelselec = focusedEvent.id;
    if (focusedEvent.id !== "info") {
       this.selectedId = focusedEvent.id;
       //console.log("selec id: ")+this.selectedId;
      //  this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    //console.log("stateChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    //console.log("focusedEvent.id: "+focusedEvent.id);

    if (focusedEvent.id !== "info") {
       this.selectedId = focusedEvent.id;
       //console.log("selec id: ")+this.selectedId;
      //  this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
}


  ngOnInit() {
    // console.log("en ngOnInit editregCliepotecial");
    this.activatedRouter.params
      .subscribe(parametros => {
        // this.varParam = parametros['varParam'];
        // this.id = parametros['id'];
        this.id = NetsolinApp.oapp.cuserid;

        let lvart: any;
        this.title = 'Monitor Principal';
        this.rutamant = '';
        this.paplica = '0';
        this.ptablab = 'XGTS02';
        this.pcampollave = 'xgts2c7';
        this.pcamponombre = 'xgts2c2';
        this.pclase_nbs = '';
        this.pclase_val = '';
        let lvar = '';
        // lvar = localStorage.getItem("DDT" + this.ptablab);
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
             var result0 = regTabla[0];
            if (typeof (result0) != "undefined") {
              this.enlistaerror = true;
              this.listaerrores = regTabla;
            } else {
              this.regUsuario = regTabla;
              // console.log('Trae regUsuario');
              // console.log(this.regUsuario);
              // console.log('NetsolinApp.oapp');
              // console.log(NetsolinApp.oapp);
              this.filtroactividades = "usuario='"+NetsolinApp.oapp.cuserid+"'";
              this.paramusuar.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramocotizaborrador.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramocotizaenproceso.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramocotizaganadas.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramocotizacanceladas.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramocotizaperdidas.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividadcitas.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividademail.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividadllamadas.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividadpenvenc.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividadpenxvenc.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividadsegui.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividadservi.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramactividadtareas.cod_usuar = NetsolinApp.oapp.cuserid;

              this.paramocotizaborrador.ano = this.ano;
              this.paramocotizaenproceso.ano = this.ano;
              this.paramocotizaganadas.ano = this.ano;
              this.paramocotizacanceladas.ano = this.ano;
              this.paramocotizaperdidas.ano = this.ano;
              this.paramactividadcitas.ano = this.ano;
              this.paramactividademail.ano = this.ano;
              this.paramactividadllamadas.ano = this.ano;
              this.paramactividadpenvenc.ano = this.ano;
              this.paramactividadpenxvenc.ano = this.ano;
              this.paramactividadsegui.ano = this.ano;
              this.paramactividadservi.ano = this.ano;
              this.paramactividadtareas.ano = this.ano;

              this.paramocotizaborrador.mes = this.mes;
              this.paramocotizaenproceso.mes = this.mes;
              this.paramocotizaganadas.mes = this.mes;
              this.paramocotizacanceladas.mes = this.mes;
              this.paramocotizaperdidas.mes = this.mes;
              this.paramactividadcitas.mes = this.mes;
              this.paramactividademail.mes = this.mes;
              this.paramactividadllamadas.mes = this.mes;
              this.paramactividadpenvenc.mes = this.mes;
              this.paramactividadpenxvenc.mes = this.mes;
              this.paramactividadsegui.mes = this.mes;
              this.paramactividadservi.mes = this.mes;
              this.paramactividadtareas.mes = this.mes;
              this.cargousuario = true;
              this.inicializaMonitor(regTabla);
            }
          }, error => {
            this.showError(error);
          })
      });
  }

  inicializaMonitor(preg: any) {
    // console.log('usuar cotiza preg');
    // console.log(preg);
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    this.cargando = true;
    this.resultados = false;
    var cbus=preg.xgts2c7;
    //Mientras prueba
    if (!environment.production) {
      cbus='NETSOLIN   '
    }
    this.filtrocotiza = "c.usuar_crea='" + cbus+"'" ;
    // console.log('this.filtrocotiza:'+this.filtrocotiza);
    // this.filtrocotiza=preg.id_cliepote.toString();
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }
  public valueChange(value: any): void {    
    console.log('valueChange', value);
    this.ano = value;
    this.paramocotizaborrador.ano = value;
    this.paramocotizaenproceso.ano = value;
    this.paramocotizaganadas.ano = value;
    this.paramocotizacanceladas.ano = value;
    this.paramocotizaperdidas.ano = value;
    this.paramactividadcitas.ano = value;
    this.paramactividademail.ano = value;
    this.paramactividadllamadas.ano = value;
    this.paramactividadpenvenc.ano = value;
    this.paramactividadpenxvenc.ano = value;
    this.paramactividadsegui.ano = value;
    this.paramactividadservi.ano = value;
    this.paramactividadtareas.ano = value;
}
public valueChangemes(value: any): void {    
  console.log('valueChangemes', value);
  this.mes = value.mes;
  this.paramocotizaborrador.mes = value.mes;
  this.paramocotizaenproceso.mes = value.mes;
  this.paramocotizaganadas.mes = value.mes;
  this.paramocotizacanceladas.mes = value.mes;
  this.paramocotizaperdidas.mes = value.mes;
  this.paramactividadcitas.mes = value.mes;
  this.paramactividademail.mes = value.mes;
  this.paramactividadllamadas.mes = value.mes;
  this.paramactividadpenvenc.mes = value.mes;
  this.paramactividadpenxvenc.mes = value.mes;
  this.paramactividadsegui.mes = value.mes;
  this.paramactividadservi.mes = value.mes;
  this.paramactividadtareas.mes = value.mes;
}

  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
  }

  onSubmit() {
    this.enerror = false;
    // this.grabo = false;
   }
 
  showError(msg) {
    this.message = msg;
    this.enerror = true;
    // console.log(this.message);
  }

  showMensaje(msg) {
    this.message = msg;
    this.enerror = false;
    // console.log(this.message);
  }

  retornaRutaAcampana() {
    // addregtbasica/VPARCOMPETENCIA
  }


 
 
  openconsulta(ptipo){
    if (ptipo == 'llamabusqueda') {
      this.llamabusqueda = true;
    }   
    
  }
  public closeconsulta(ptipo) {
  }
  public closebusquellama(event){
    // console.log('en moni cliepote llega sde bus prod:'+event);
    this.pruellegallabusque=event;
    this.llamabusqueda = false;

  }

  openeditar(ptipo){
  }
  public closeeditar(ptipo) {
  }
  
  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == 'cotiza') {
      this.crearcotiza = true;
    } 
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    if (ptipo == 'cotiza') {
      this.crearcotiza = false;
    } 
  }

  retornaRutacotiza() {
    // console.log('ruta cotiza');
    // console.log('/cotizacion'+ '/VARPARCOTIZACRM_C/0' +  '/' + this.regCliepote.id_cliepote+ '/' + this.regCliepote.id_cliepote+'/A');
    return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' +  '0/' + '0/A/na/na';
  }

}
