import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { PanelBarExpandMode, PanelBarItemModel } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../../shared/global';
import { MantbasicaService } from '../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../services/mantbasica.libreria';
import { NetsolinService } from '../../../../services/netsolin.service';
import { varGlobales } from '../../../../shared/varGlobales';


// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';

@Component({
  selector: 'monitor-clientepoten',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorclienpotenComponent implements OnInit {
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
  crearsectore = false;
  crearorigencp = false;
  consultatercero = false;
  consultacliepoten = false;
  consultacuenta = false;
  editatercero = false;
  editacliepoten = false;
  editacuenta = false;
  nom_empre: string;
  cargocliepote = false;
  regCliepote: any;
  cargotercero = false;
  regTercero: any;
  cargocliente = false;
  regCliente: any;
  cargocliepoten = false;
  regCliepoten: any;
  cargocontacto = false;
  regContacto: any;
  vvalocategoria: string;
  filtrocontacto: string;
  filtroactividades:string="";
  filtroarchivos:string="";
  filtrocotiza:string="";
  id_terconsulta: string;s
  id_cliepoten: string;
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje=false;

  pruebavininumbuscombog:string = "";
  llamabusqueda = false;
  pruellegallabusque:string="";

//configuracion menu panelinfo
public itemsinfo: Array<PanelBarItemModel> = [
    <PanelBarItemModel> {title: "General", id:'infgen',selected:true },
    <PanelBarItemModel> {title: "Marketing", id:'infmark' },
    <PanelBarItemModel> {title: "Contacto Inicial", id:'infcontac' },
    <PanelBarItemModel> {title: "Contactos", id:'infcon' },
    <PanelBarItemModel> {title: "Archivos", id:'infarch' }
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
    private httpc: HttpClient
  ) {
    this.vglobal.mostrarbreadcrumbs = false;
    this.infopanelselec='infgen';
  }

  //solo para prueba buscombog
  verCombocod_refven(event, pcamporecibe, pcamporetorna) {
    //  console.log("verCombocod_refven llega de buscomobog 1");
    //  console.log(pcamporecibe);
    //  console.log(pcamporetorna);
    //  console.log(event);
     
   
  }
  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    // public onPanelChange(event: any) { 
    // console.log("onPanelChange: ", event); 
    // console.log("onPanelChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    // console.log("focusedEvent.id: "+focusedEvent.id);
    this.infopanelselec = focusedEvent.id;
    if (focusedEvent.id !== "info") {
       this.selectedId = focusedEvent.id;
      //  console.log("selec id: ")+this.selectedId;
      //  this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    // console.log("stateChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    // console.log("focusedEvent.id: "+focusedEvent.id);

    if (focusedEvent.id !== "info") {
       this.selectedId = focusedEvent.id;
      //  console.log("selec id: ")+this.selectedId;
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
        this.service.verificaVpar('CRMCLIENTECP01','VPARCLIENPOTEN')
        .subscribe(resultado => {
        let lvart: any;
        lvart = localStorage.getItem(this.varParam);
        let lobjpar = JSON.parse(lvart);
        this.title = 'Monitor Cliente potencial';
        // lobjpar.titulo;
        // this.rutamant = lobjpar.rutamant;
        this.rutamant = '';
        this.paplica = lobjpar.aplica;
        this.ptablab = lobjpar.tabla;
        this.pcampollave = lobjpar.campollave;
        this.pcamponombre = lobjpar.camponombre;
        this.pclase_nbs = lobjpar.clase_nbs;
        this.pclase_val = lobjpar.clase_val;
        let lvar = '';
        lvar = localStorage.getItem("DDT" + this.ptablab);
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
             var result0 = regTabla[0];
            if (typeof (result0) != "undefined") {
              this.enlistaerror = true;
              this.listaerrores = regTabla;
            } else {
              this.regCliepote = regTabla;
              this.filtroactividades = "id_cliepote="+regTabla.id_cliepote;
              this.filtroarchivos = "mod_asociado=2 and id_cliepote="+regTabla.id_cliepote;                            
              this.cargocliepote = true;
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
    //traer el tercero
    this.cargotercero = false;
    //establecer filtro filtrocontacto
    this.filtrocontacto="id_cliepote="+preg.id_cliepote.toString();
    var cbus=preg.id_cliepote.toString();
    this.filtrocotiza = "c.id_cliepote=" + cbus ;
    // console.log('this.filtrocotiza:'+this.filtrocotiza);
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
    if (ptipo == 'tercero') {
      this.consultatercero = true;
    } else if (ptipo == 'cliepoten') {
      this.consultacliepoten = true;
    }  else if (ptipo == 'cuenta') {
      this.consultacuenta = true;
    } else if (ptipo == 'llamabusqueda') {
      this.llamabusqueda = true;
    }   
    
  }
  public closeconsulta(ptipo) {
    if (ptipo == 'tercero') {
      this.consultatercero = false;
    } else if (ptipo == 'cliepoten') {
      this.consultacliepoten = false;
    } else if (ptipo == 'cuenta') {
      this.consultacuenta = false;
    } 
  }
  public closebusquellama(event){
    // console.log('en moni cliepote llega sde bus prod:'+event);
    this.pruellegallabusque=event;
    this.llamabusqueda = false;

  }

  openeditar(ptipo){
    if (ptipo == 'tercero') {
      this.editatercero = true;
    } else if (ptipo == 'cliepoten') {
      this.editacliepoten = true;
    }  else if (ptipo == 'cuenta') {
      this.editacuenta = true;
    }   
    
  }
  public closeeditar(ptipo) {
    if (ptipo == 'tercero') {
      this.editatercero = false;
    } else if (ptipo == 'cliepoten') {
      this.editacliepoten = false;
    } else if (ptipo == 'cuenta') {
      this.editacuenta = false;
    }
  }
  
  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == 'cotiza') {
      this.crearcotiza = true;
    } else if (ptipo == 'sectore') {
      this.crearsectore = true;
    } else if (ptipo == 'origencp') {
      this.crearorigencp = true;
    }
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    if (ptipo == 'cotiza') {
      this.crearcotiza = false;
    } else if (ptipo == 'sectore') {
      this.crearsectore = false;
    } else if (ptipo == 'origencp') {
      this.crearorigencp = false;
    }
  }

  retornaRutacotiza() {
    // console.log('ruta cotiza');
    // console.log('/cotizacion'+ '/VARPARCOTIZACRM_C/0' +  '/' + this.regCliepote.id_cliepote+ '/' + this.regCliepote.id_cliepote+'/A');
    return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' + this.regCliepote.id_cliepote+ '/' + this.regCliepote.id_cuenta+'/A/na/na';
  }
  refrescaArchivos(regDeta) {
    // console.log('llega refresca refrescaArchivos reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
  }

}
