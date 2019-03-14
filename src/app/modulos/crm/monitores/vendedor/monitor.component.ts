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
  selector: 'monitor-vendedor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorVendedorComponent implements OnInit {
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
  cargovendedor = false;
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
  //Enviar variable a graficos
  clasegrafico:string;
  linkmonivended:string="";
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;
  anofiltro = this.ano.toString().trim();
  mesfiltro = this.mes.toString().trim();

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

  oparamgraficollamadasdia : any ={
    objeto:'GRAFCRMXTACTIVDIA',
    usuario: 'NETSOLIN',
    tipo_act: 'L',
    opcion: 'L',
    opcion2: '00',
    estado: 'A',
    ano: this.ano,
    mes: this.mes
  };


  oparamgraficocotizadia : any ={
    objeto:'GRAFCRMXTACOTIZADIA',
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
  public paramocotizaganadas: any = {titulo: "Ganadas",cod_vended :"",tipo:"G", numreg:20}
  public paramocotizacanceladas: any = {titulo: "Canceladas",cod_vended :"",tipo:"C", numreg:10}
  public paramocotizaperdidas: any = {titulo: "Perdidas",cod_vended :"",tipo:"P", numreg:20}
  public paramocotizaborrador: any = {titulo: "Borrador",cod_vended :"",tipo:"B", numreg:20}
  public paramocotizaenproceso: any = {titulo: "En proceso",cod_vended :"",tipo:"O", numreg:20}

  public paramtabvendcrm: any = {titulo: "Monitor  Vendedor ",cod_usuar :"",cod_vended:"", ano:this.ano}
  
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
    private service: NetsolinService,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    private sanitizer: DomSanitizer

  ) {
    this.vglobal.mostrarbreadcrumbs = false;

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
    // console.log("en ngOnInit editregCliepotecial");
    this.activatedRouter.params
      .subscribe(parametros => {
        // this.varParam = parametros['varParam'];
        // this.id = parametros['id'];
        if (this.vparcaptura) {
          this.varParam = this.vparcaptura;
        } else {
          this.varParam = parametros['varParam'];
        }
        // this.id = parametros['id'];
        if (this.vparcaptura) {
          this.id = this.vid;
        } else {
          this.id = parametros['id'];
        }
        //ASEGURARSE QUE ESTA VAR PARAMETROS EN LOCALSTORAGE
        this.service.verificaVpar('CRMVENDEDOR','VPARVENDEDORES')
        .subscribe(resultado => {
        let lvart: any;
        lvart = localStorage.getItem(this.varParam);
        let lobjpar = JSON.parse(lvart);
        this.title = 'Monitor vendedor';
        this.rutamant = '';
        this.paplica = '0';
        this.ptablab = 'VENDEDORES';
        this.pcampollave = 'cod_vended';
        this.pcamponombre = 'detalle';
        this.pclase_nbs = '';
        this.pclase_val = '';
        let lvar = '';
        lvar = localStorage.getItem("DDT" + this.ptablab);
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
             var result0 = regTabla[0];
            if (typeof (result0) != "undefined") {
              this.enlistaerror = true;
              this.listaerrores = regTabla;
            } else {
              this.regVendedor = regTabla;
              console.log('Trae regvendedor');
              console.log(this.regVendedor);
              this.filtroactividades = "usuario='"+regTabla.cod_vended+"'";
              this.linkmonivended="../EjeConsultaLis.wss?VRCod_obj=MONITORVENDTLTE&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_VENDED='"+regTabla.cod_vended+"',PVXIANO="+this.anofiltro;
              this.paramtabvendcrm.cod_vended=regTabla.cod_vended;

              var fecha = new Date();
              var ano = fecha.getFullYear();
              var mes = fecha.getMonth();
      

              //this.oparamgraficollamadas.usuario=regTabla.cod_vended;
              //this.oparamgraficollamadas.ano = ano;
              //this.oparamgraficollamadas.opcion = 'L';
              //this.oparamgraficollamadas.opcion2 = '00';


              this.oparamgraficollamadasdia.usuario=regTabla.cod_vended;
              this.oparamgraficollamadasdia.ano = ano;
              this.oparamgraficollamadasdia.mes = mes;
              this.oparamgraficollamadasdia.opcion = 'L';
              this.oparamgraficollamadasdia.opcion2 = '00';

              
              this.oparamgraficocotizadia.usuario=regTabla.cod_vended;
              this.oparamgraficocotizadia.ano = ano;
              this.oparamgraficocotizadia.mes = mes;
              this.oparamgraficocotizadia.opcion = 'G';
              this.oparamgraficocotizadia.opcion2 = '00';
              
              this.paramocotizaborrador.cod_vended = regTabla.cod_vended;
              this.paramocotizaenproceso.cod_vended = regTabla.cod_vended;
              this.paramocotizaganadas.cod_vended = regTabla.cod_vended;
              this.paramocotizacanceladas.cod_vended = regTabla.cod_vended;
              this.paramocotizaperdidas.cod_vended = regTabla.cod_vended;

              this.cargovendedor = true;
              this.inicializaMonitor(regTabla);
            }
          }, error => {
            this.showError(error);
          });
        }, error => {
          this.showError(error);
          
        });
      });
  }

  inicializaMonitor(preg: any) {
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    this.cargando = true;
    this.resultados = false;
    var cbus=preg.cod_vended;
    this.filtrocotiza = "c.cod_vended='" + cbus+"'" ;
    console.log('this.filtrocotiza:'+this.filtrocotiza);
    // this.filtrocotiza=preg.id_cliepote.toString();
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
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
  conmutacollapse(){
    this.collapse = !this.collapse;
  }
  esconderpanel(){
    this.esconder = true;
  }

  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }
  
}
