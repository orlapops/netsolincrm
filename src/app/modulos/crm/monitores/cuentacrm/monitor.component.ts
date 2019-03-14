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

import { DomSanitizer } from '@angular/platform-browser';


// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';

@Component({
  selector: 'monitor-cuentacrm',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorcuentaComponent implements OnInit {
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
  cargocuenta = false;
  regCuenta: any;
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
  linkmoniventas='../EjeConsultaLis.wss?VRCod_obj=MONITORVENTASGENLTE&VCAMPO=COD_CUENTA&VCONDI=Inicia&VTEXTO='  
  linkcarteracuetna='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=MONITORCARTERAXCD&VCAMPO=USUARIO&VCONDI=Inicia&VTEXTO=PVXICOD_CUENTA='+"''"
  linkaddarchivo:string="";
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;

  public paramtabgencuentacrm: any = {titulo: "Monitor  Cuenta Crm",cod_usuar :"",cod_tercer:"", ano:this.ano}


//configuracion menu panelinfo
public itemsinfo: Array<PanelBarItemModel> = [
    <PanelBarItemModel> {title: "General", id:'infgen',selected:true },
    <PanelBarItemModel> {title: "Marketing", id:'infmark' },
    <PanelBarItemModel> {title: "Facturación", id:'infclie' },
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
    private httpc: HttpClient,
    private sanitizer: DomSanitizer
    
  ) {
    this.vglobal.mostrarbreadcrumbs = false;
    this.infopanelselec='infgen';
    this.linkcarteracuetna+=',PVXICOD_TERCER='+"'830099553',PVXICOD_ZONA='',PVXICOD_VENDED='',PVXIMONEDA='',PVXICENTRO='',PVXISUBCENTRO='',PVXICOD_CUENTA='',PVXIANO="+this.ano.toString() +'","Home","700px","100%",true)';
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
    // console.log("en ngOnInit editregcuentacial");
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
        this.service.verificaVpar('CRMCLIENTECUE01','VPARCUENTACRM')
        .subscribe(resultado => {
          console.log('resultado veriifca vpar');
          console.log(resultado);
          let lvart: any;
          lvart = localStorage.getItem(this.varParam);
          let lobjpar = JSON.parse(lvart);
          this.title = 'Monitor Cuenta';
          // lobjpar.titulo;
          this.rutamant = lobjpar.rutamant;
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
                this.regCuenta = regTabla;
                this.linkmoniventas="../EjeConsultaLis.wss?VRCod_obj=MONITORCLIE02&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_TERCER='"+regTabla.cod_tercer+"',PVXIANO="+this.ano.toString().trim();
                this.paramtabgencuentacrm.cod_tercer=regTabla.cod_tercer;
                this.filtroactividades = "id_cuentacrm="+regTabla.id_cuentacrm;
                this.filtroarchivos = "mod_asociado=3 and id_cuentacrm="+regTabla.id_cuentacrm;              
                this.cargocuenta = true;
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
    this.filtrocontacto="id_cuenta="+preg.id_cuentacrm.toString();
    // EjeConsultaLis.wss?VRCod_obj=MONITORCLIE02&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_TERCER=%27901085321%20%20%27,PVXIANO=2018
    // this.linkcarteracuetna='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=MONITORCARTERAXCD&VCAMPO=USUARIO&VCONDI=Inicia&VTEXTO=PVXICOD_CUENTA='+"''";
    // this.linkcarteracuetna+=',PVXICOD_TERCER='+"'"+preg.cod_tercer+"',PVXICOD_ZONA='',PVXICOD_VENDED='',PVXIMONEDA='',PVXICENTRO='',PVXISUBCENTRO='',PVXICOD_CUENTA='',PVXIANO=2018"+'","Home","700px","100%",true)';
    this.linkcarteracuetna='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=MONITORCLIE02&VCAMPO=USUARIO&VCONDI=Inicia&VTEXTO=';
    this.linkcarteracuetna+='PVXICOD_TERCER='+"'"+preg.cod_tercer+"',PVXIANO="+this.ano.toString().trim() + '","Home","700px","100%",false)';
    this.linkaddarchivo='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=CRMADDARCHIVOMOD&VCAMPO=USUARIO&VCONDI=Inicia&VTEXTO=';
    this.linkaddarchivo+='PVXICOD_DOCUME='+"'"+"FV1"+"',PVXINUM_DOCUME="+"'"+"    3054"+"'"+'","Home","500px","100%",false)';
    console.log('this.linkaddarchivo');
    console.log(this.linkaddarchivo);
    var cbus=preg.id_cuentacrm.toString();
    this.filtrocotiza = "c.id_cuentacrm=" + cbus ;
    // this.filtrocotiza=preg.id_cuentacrm.toString();
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    if (preg.cod_tercer) {
      this.mantbasicaService.getregTabla(preg.cod_tercer, "TERCEROS", "21", "cod_tercer", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof (regTabla) != "undefined") {
            this.regTercero = regTabla;
            this.id_terconsulta = regTabla.cod_tercer;
            //cargar cliente
            this.cargocliente = false;
            this.mantbasicaService.getregTabla(preg.cod_tercer, "CLIENTES", "21", "cod_tercer", "", "", "contacto")
              .subscribe(regTabla => {
                if (typeof (regTabla) != "undefined") {
                  this.regCliente = regTabla;
                  this.cargocliente = true;
                  // this.tabstrip.selectTab(0);
                }
              });
            this.cargotercero = true;
          }
        })
    }

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
    // console.log('en moni cuentas llega sde bus prod:'+event);
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
    // console.log('/cotizacion'+ '/VARPARCOTIZACRM_C/0' +  '/' + this.regCuenta.id_cliepote+ '/' + this.regCuenta.id_cuentacrm+'/A');
    return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' + this.regCuenta.id_cliepote+ '/' + this.regCuenta.id_cuentacrm+'/A/na/na';
  }

  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }
  
  refrescaArchivos(regDeta) {
    // console.log('llega refresca refrescaArchivos reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
  }

//   public adicionarCotiza(): void {

//     var pruta = '/cotizacion/VARPARCOTIZACRM_C';
//     console.log("adiciona click pruta:" + pruta);
//     // console.log("pvalc:" + pvalc);
//     this.router.navigate([pruta, 0,this.regCuenta.id_cliepote,this.regCuenta.id_cuentacrm,'A']);
// }

  

}
