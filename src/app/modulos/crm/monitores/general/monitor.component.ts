import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { PanelBarExpandMode, PanelBarItemModel } from '@progress/kendo-angular-layout';
import { NetsolinApp } from '../../../../shared/global';
import { MantbasicaService } from '../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../services/mantbasica.libreria';
import { varGlobales } from '../../../../shared/varGlobales';
import { NetsolinService } from '../../../../services/netsolin.service';
import { DomSanitizer } from '@angular/platform-browser';

// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';

@Component({
  selector: 'monitor-general',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorGeneralComponent implements OnInit {
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
  nom_empre: string;
  cargodatos = false;
  regVendedor: any;
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
  collapse=false;
  esconder=false;
  collapse1=true;
  esconder1=false;
  collapse2=true;
  esconder2=false;
  collapse3=true;
  esconder3=false;
  //Enviar variable a graficos
  clasegrafico:string;
  linkmoniventas='../EjeConsultaLis.wss?VRCod_obj=MONITORVENTASGENLTE&VCAMPO=COD_CUENTA&VCONDI=Inicia&VTEXTO='
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;
  anofiltro = this.ano.toString().trim();
  mesfiltro= this.mes.toString().trim();
  ltitulocotixvend = "Cotizaciones perdidas por Vendedor";


 // oparamgraficollamadas : any ={
 //   objeto:'GRAFCRMXTACTIV',
 //   usuario: 'NETSOLIN',
 //   tipo_act: 'L',
 //   opcion: 'L',
 //   opcion2: '00',
 //   estado: 'A',
 //   ano: 2018,
 //   mes: 1
 // }

  oparamgraficollamadasven : any ={
    objeto:'GRAFCRMXACTIVEN',
    usuario: 'NETSOLIN',
    tipo_act: 'L',
    opcion: 'L',
    opcion2: '00',
    estado: 'E',
    ano: this.ano,
    mes: this.mes
  };

  oparamgraficovenxvende : any ={
    objeto:'GRAFCRMCOTXVENDA',
    usuario: 'NETSOLIN',
    opcion: 'G',
    estado_c: 'G',
    opcion2: '00',
    ano: this.ano,
    mes: this.mes
  };
  oparamgraficovenganxvende : any ={
    objeto:'GRAFCRMCOTGXVENDA',
    usuario: 'NETSOLIN',
    opcion: 'G',
    estado_c: 'G',
    opcion2: '00',
    ano: this.ano,
    mes: this.mes
  };
  oparamgraficovenperxvende : any ={
    objeto:'GRAFCRMCOTPXVENDA',
    usuario: 'NETSOLIN',
    opcion: 'G',
    estado_c: 'G',
    opcion2: '00',
    ano: this.ano,
    mes: this.mes
  };
  oparamgraficocotizaven : any ={
    objeto:'GRAFCRMXCOTIZAVEN',
    usuario: 'NETSOLIN',
    opcion: 'G',
    estado_c: 'G',
    opcion2: '00',
    ano: this.ano,
    mes: this.mes
  };

  pruebavininumbuscombog:string = "";
  llamabusqueda = false;
  pruellegallabusque:string="";

//configuracion menu panelinfo
public itemsinfo: Array<PanelBarItemModel> = [
    <PanelBarItemModel> {title: "General", id:'infgen',selected:true },
    <PanelBarItemModel> {title: "Marketing", id:'infmark' },
    <PanelBarItemModel> {title: "Contacto Inicial", id:'infcontac' },
    <PanelBarItemModel> {title: "Contactos", id:'infcon' }
];
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
public paramtabgencrm: any = {titulo: "Monitor  Generarl Crm",cod_usuar :"", ano:this.ano, mes: this.mes}
  
private selectedId: string = "";


  private baseImageUrl: string = "https://demos.telerik.com/kendo-ui/content/web/panelbar/";

  private imageUrl(imageName: string) :string {
      return this.baseImageUrl + imageName + ".jpg";
  }

  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private service: NetsolinService,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.vglobal.mostrarbreadcrumbs = false;
    //llenar array ultimos 5 años
    this.listanos.push(this.ano);
    this.listanos.push(this.ano-1);
    this.listanos.push(this.ano-2);
    this.listanos.push(this.ano-3);
    this.listanos.push(this.ano-4);
    console.log(this.listanos);
  }

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    // public onPanelChange(event: any) { 
    console.log("onPanelChange: ", event); 
    console.log("onPanelChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    console.log("focusedEvent.id: "+focusedEvent.id);
    this.infopanelselec = focusedEvent.id;
    if (focusedEvent.id !== "info") {
       this.selectedId = focusedEvent.id;
       console.log("selec id: ")+this.selectedId;
      //  this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    console.log("stateChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    console.log("focusedEvent.id: "+focusedEvent.id);

    if (focusedEvent.id !== "info") {
       this.selectedId = focusedEvent.id;
       console.log("selec id: ")+this.selectedId;
      //  this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
}


  ngOnInit() {
//      this.inicializaMonitor(regTabla);
  this.inicializaMonitor();
}

  inicializaMonitor() {
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    // this.cargando = true;
    // this.resultados = false;

    this.cargando = false;
    this.resultados = true;
    this.cargodatos = true;
    console.log('inicializo resultado');
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }
  public valueChange(value: any): void {    
    console.log('valueChange', value);
    this.ano = value;
    this.paramtabgencrm.ano = value;
    this.oparamgraficollamadasven.ano = value;
    this.oparamgraficovenxvende.ano = value;
    this.oparamgraficovenganxvende.ano = value;
    this.oparamgraficovenperxvende.ano = value;
    this.oparamgraficocotizaven.ano = value;  
}
public valueChangemes(value: any): void {    
  console.log('valueChangemes', value);
  this.mes = value.mes;
  this.paramtabgencrm.mes = value.mes;
  this.oparamgraficollamadasven.mes = value.mes;
  this.oparamgraficovenxvende.mes = value.mes;
  this.oparamgraficovenganxvende.mes = value.mes;
  this.oparamgraficovenperxvende.mes = value.mes;
  this.oparamgraficocotizaven.mes = value.mes;
  
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
    console.log('en moni cliepote llega sde bus prod:'+event);
    this.pruellegallabusque=event;
    this.llamabusqueda = false;

  }

  openeditar(ptipo){
  }
  public closeeditar(ptipo) {
  }
  
  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
  }

  retornaRutacotiza() {
    // console.log('ruta cotiza');
    // console.log('/cotizacion'+ '/VARPARCOTIZACRM_C/0' +  '/' + this.regCliepote.id_cliepote+ '/' + this.regCliepote.id_cliepote+'/A');
    return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' +  '0/' + '0/A/na/na';
  }
  conmutacollapse(ppanel){
    switch (ppanel){
      case 0:
        this.collapse = !this.collapse;
        break;
      case 1:
        this.collapse1 = !this.collapse1;
        break;
      case 2:
        this.collapse2 = !this.collapse2;
        break;
      case 3:
        this.collapse3 = !this.collapse3;
        break;
    }
  }
  esconderpanel(ppanel){
    switch (ppanel){
      case 0:
        this.esconder = true;
        break;
      case 1:
        this.esconder1 = true;
        break;
      case 2:
        this.esconder2 = true;
        break;
      case 3:
        this.esconder3 = true;
        break;
    }
  }
  
  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }

  filtroAno(event){
    //recibe de componete filtrnaomes 
   console.log("filtroAno 1");
    console.log(event);
      if (event) {
        this.anofiltro = event.opcion;
        this.oparamgraficollamadasven.ano =  this.anofiltro;
        this.oparamgraficocotizaven.ano  =  this.anofiltro;
        this.oparamgraficovenganxvende.ano  =  this.anofiltro;
        this.oparamgraficovenperxvende.ano  =  this.anofiltro;
        this.oparamgraficovenxvende.ano  =  this.anofiltro;
        this.ltitulocotixvend = "Cotiza x Vendedor año: "+this.anofiltro;
        console.log("this.ltitulocotixvend:"+this.ltitulocotixvend);
        console.log("this.anofiltro:"+this.anofiltro);
        // return
      }
  }

  filtroMes(event){
    //recibe de componete filtrnaomes 
   console.log("filtroMes 1");
    console.log(event);
      if (event) {
        this.mesfiltro = event.id;
        console.log("this.mesfiltro:"+this.mesfiltro);
      }
  }
  
}
