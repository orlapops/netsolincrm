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
//Monitor Producto Fuera de Catalogo
@Component({
  selector: 'monitor-productofccrm',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorproductofcComponent implements OnInit {
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
  subtitle = '(Monitor producto fuera de catalogo)';
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  consultaproducto = false;
  editaproducto = false;
  nom_empre: string;
  regProdfcat: any;
  regCliepoten: any;
  regproducto=false;
  cargoproducto = false;
  vvalocategoria: string;
  filtroarchivos:string="";
  filtrocotiza:string="";
  id_prod: string;
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje=false;

  pruebavininumbuscombog:string = "";
  llamabusqueda = false;
  pruellegallabusque:string="";
  linkimagen:string="";
  linkaddarchivo:string="";
  linkcreaimagen:string="";
  consultaficha=false;  
  existefichatec=false;
  crearimagen=false;
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;

  public paramtabarchivos: any = {titulo: "Archivos",cod_usuar :"",cod_prod:"", ano:this.ano}


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
    // console.log("en ngOnInit editregProdfcatcial");
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
        this.service.verificaVpar('CRMPRODUCTOS01','VPARPRODUCTOS')
        .subscribe(resultado => {
        let lvart: any;
        lvart = localStorage.getItem(this.varParam);
        let lobjpar = JSON.parse(lvart);
        this.title = 'Monitor producto';
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
              this.regProdfcat = regTabla;
              var fecha = new Date();
              var ano = fecha.getFullYear();
              this.paramtabarchivos.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramtabarchivos.cod_prod = this.regProdfcat.cod_prod;
              this.paramtabarchivos.ano = ano;
              //Traer links para la imagen
              NetsolinApp.objenvrest.tiporet= "CON";
              this.service.getNetsolinObjconParametros("MONTABPRODFCIMAGEN",this.paramtabarchivos)
              .subscribe(result => {
                console.log('Imagen result:');
                console.log(result);
                  var result0 = result[0];
                  // console.log(result0);
                  if (typeof result.isCallbackError === "undefined") {       
                    //viene con links y datos imagen
                    this.linkimagen = result0.linkimg;                    
                    if (!result0.existe){
                      this.linkcreaimagen=result0.linkcreaimg;
                      this.crearimagen=true;
                    } else {
                      this.linkcreaimagen=result0.linkcreaimg;
                      this.crearimagen=false;                      
                    }
                    if (!result0.existefichat){
                      this.existefichatec=false;
                    } else {
                      this.existefichatec=true;                      
                    }
                     
                    // console.log(this.linkimagen);
                    // console.log(this.crearimagen);
                    // console.log(this.linkcreaimagen);
                  } else {
                    //viene el registro con el error
                    console.log("Error en ejecutaObjeto 1");
                    console.log(result);
                  }
                },
                error => {
                  console.log("Error en ejecutaObjeto2 ");
                  console.log(error);
                }
              );
              
              // this.filtroarchivos = "mod_asociado=8 and id_modasocia="+regTabla.id;              
              this.regproducto = true;
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
    this.cargoproducto = false;
    this.linkaddarchivo='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=INVREFARCHIVOS01&VCAMPO=USUARIO&VCONDI=Inicia&VTEXTO=';
    this.linkaddarchivo+='PVXICOD_REFINV='+"'"+preg.cod_prod+"'"+'","Home","500px","100%",false)';
    
    console.log('this.linkaddarchivo');
    console.log(this.linkaddarchivo);
    // var cbus=preg.id.toString();
    var cbus=preg.cod_prod;
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
    if (ptipo == 'producto') {
      this.consultaproducto = true;
    }  else if (ptipo == 'fichatec') {
      this.consultaficha = true;
    }  
    
  }
  public closeconsulta(ptipo) {
    if (ptipo == 'producto') {
      this.consultaproducto = false;
    } else if (ptipo == 'fichatec') {
      this.consultaficha = false;
    } 
  }
  public closebusquellama(event){
    // console.log('en moni productos llega sde bus prod:'+event);
    this.pruellegallabusque=event;
    this.llamabusqueda = false;

  }

  openeditar(ptipo){
    if (ptipo == 'producto') {
      this.editaproducto = true;
    }   
    
  }
  public closeeditar(ptipo) {
   if (ptipo == 'producto') {
      this.editaproducto = false;
    }
  }
  

  retornaRutacotiza() {
    // return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' + this.regProdfcat.id_cliepote+ '/' + this.regProdfcat.id_cuentacrm+'/A/na/na';
  }

  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }
  
  refrescaArchivos(regDeta) {
    // console.log('llega refresca refrescaArchivos reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
  }

 

}
