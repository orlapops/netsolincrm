import { Component, VERSION, OnInit, Input, ViewChild,ElementRef, Renderer2 } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  ValidatorFn
} from "@angular/forms";

import { Router, ActivatedRoute } from "@angular/router";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import { ComboBoxComponent } from "@progress/kendo-angular-dropdowns";
import { MantbasicaService } from "../../../../services/mantbasica.service";
import { NetsolinService } from "../../../../services/netsolin.service";
import { MantablasLibreria } from "../../../../services/mantbasica.libreria";
import { NetsolinApp } from "../../../../shared/global";
import { UpperCaseTextDirective } from "../../../../netsolinlibrerias/directive/upper-case.directive";
import { varGlobales } from "../../../../shared/varGlobales";
interface Item {
  text: string,
  value: string
}
interface ItemCausperd {
  id: string,
  text: string,
  nombre: string
}
interface ItemCompetidor {
  id: string,
  text: string,
  nombre: string
}
interface ItemDirdespa {
  id: string,
  text: string,
  nombre: string
}
interface ItemFormas {
  cod_docume; string;
  id: string,
  text: string
}
@Component({
  selector: "crm-mantcotizacion",
  templateUrl: "./mantcotiza.component.html",
  styleUrls: ["./mantcotiza.component.css"]
})
export class MantcotizacionComponent implements OnInit {
  @Input() vparcaptura: string;
  @Input() ptipomant: string;
  @Input() pid: any;
  @Input() pidcliepote: number;
  @Input() pidcuentacrm: number;
  @ViewChild("txtcod_tercer.inputbus") txtcod_tercer: ElementRef;
  @ViewChild("txtcod_cliepote.inputbus") txtcod_cliepote: ElementRef;  
  @ViewChild("tabstrip") public tabstrip: TabStripComponent;
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  cargando = true;
  enerror = false;
  grabo = false;
  enlistaerror = false;
  inicializado = false;
  listaerrores: any[] = [];
  message = "";
  title: string;
  subtitle = "(Mantenimiento Cotización)";
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  crearcotiza = false;
  crearcontacto = false;
  crearorigencp = false;
  crearcausalperd = false;
  consultatercero = false;
  consultacliepoten = false;
  consultacuenta = false;
  editatercero = false;
  editacliepoten = false;
  editacuenta = false;
  nom_empre: string;
  cargocuenta = false;
  cargotercero = false;
  codtercerant = "";
  regTercero: any;
  regCuenta: any;
  cargocliente = false;
  regCliente: any;
  cargoprocven = false;
  regProcven: any;
  cargocliepoten = false;
  regCliepoten: any;
  cargocontacto = false;
  regContacto: any;
  vvalocategoria: string;
  id_terconsulta: string;
  id_cuentacrm: number;
  captura_xcuenta: boolean = false;
  captura_xcliepoten: boolean = false;
  id_cliepoten: string;
  idccotiza: string;
  codcliepoteant="";
  cod_dcotiz: string;
  num_dcotiz: string;
  estadograbacotiz: string;
  //en combox para desabilitar campo como cicudad crear variable y cambiar a true
  disablecod_ciudad = false;
  disablecod_fpago = false;
  disablecod_zona = false;
  disablecod_vended = false;
  disablecod_lista = false;
  disablecod_procve = false;
  disableid_cuentacrm = false;
  disableid_cliepote = false;
  filtrocontacto: string = "";
  filtrocotizad: string;
  filtroactividades:string="";
  labelcuenta: string = "";
  labelcliepote: string = "";
  //totales
  valor_bruto: number = 0;
  valor_descuento: number = 0;
  valor_iva: number = 0;
  valor_neto: number = 0;
  valor_total: number = 0;
  //para llamados de busquedas
  llamabuscacuenta = false;
  llamabuscacliepoten = false;
  // cuentaebuscar:string="";
  grabando= false;
  condetalle = false;
  //versión minima no pinta controles adicionales para mayor rapidez
  ver_min=true;
  dialogoactivar=false;
  dialogoimprimir=false;
  dialogocerrar=false;
  dialogorevisar=false;
  dialogoconvsolped=false;
  genfichatecnica: boolean = false;
  cerrada=false;
  estado_c='';
  ngmid_causper=0;
  ngmcod_forma='';
  ngmid_competen=0;
  ngmfecha_cierre = new Date().toISOString().substring(0,10);
  ngmdescri_cierre: string = '';
  ngcierrexperdida = false;
  enerrormodal = false;  
  menerrormodal='';
  //si es valida la cotización para generar pedido
  cotvalagenped = false;
  menerrorvalagenped:any[] = [];
  linkmonipedido="";
  numpedido="";
  public listEstacierre: Array<Item> = [
    { text: "Ganada", value: "G" },
    { text: "Perdida", value: "P" },
    { text: "Cancelada", value: "C" }
  ];
  public selectedEstado: Item = this.listEstacierre[2];
  public listacausalesperd: any[] = [];
  public selectedcausalperd: ItemCausperd = this.listacausalesperd[0];
  public listacompetidores: any[] = [];
  public selectedcompetidor: ItemCompetidor = this.listacompetidores[0];
  public listaformas: any[] = [];
  public selectedformas: ItemFormas = this.listaformas[0];
  public listadirdespa: any[] = [];
  public selecteddirdespa: ItemDirdespa = this.listadirdespa[0];

  private lobjpartablas: any;    
  //var hoy = new Date();
  //this.libmantab.asignaValorcampoform(this.tablaForm, "fecha_crea", hoy.toISOString().substring(0,10));

  constructor(
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private service: NetsolinService,
    private router: Router,
    public libmantab: MantablasLibreria,
    private activatedRouter: ActivatedRoute,
    private renderer: Renderer2,
    private pf: FormBuilder
  ) {}
  ngOnInit() {
    // console.log("ngoninit mant cotiza 1");
    this.activatedRouter.params.subscribe(parametros => {
      // console.log("ngoninit cotiza 1.1");
      // this.varParam = parametros['varParam'];
      if (this.vparcaptura) {
        // console.log("ngoninit cotiza 1.2");
        this.varParam = this.vparcaptura;
        // this.pid=0;
        // this.pidcliepote=0;
        // this.pidcuentacrm=0;
      } else {
        // console.log("ngoninit cotiza 1.3");
        this.varParam = parametros["varParam"];
        // console.log("ngoninit cotiza 1.3 " + this.varParam);
        this.pid = parametros["pid"];
        // console.log("ngoninit cotiza 1.3 pid: " + this.pid);
        this.pidcliepote = parametros["pidcliepote"];
        // console.log("ngoninit cotiza 1.3 pidcliepote:" + this.pidcliepote);
        this.pidcuentacrm = parametros["pidcuentacrm"];
        // console.log("tipo pidcuentacrm:" + typeof this.pidcuentacrm);
        // console.log("ngoninit cotiza 1.3 pidcuentacrm:" + this.pidcuentacrm);
        // console.log("ngoninit cotiza 1.3 this.pidcuentacrm.length:" + this.pidcuentacrm.length);
        this.labelcuenta = "";
        this.labelcliepote = "";

        if (this.pidcuentacrm != 0) {
          this.captura_xcuenta = true;
          this.captura_xcliepoten = false;
          // console.log("captura por cuenta");
        } else if (this.pidcliepote != 0) {
          this.captura_xcuenta = false;
          this.captura_xcliepoten = true;
          // console.log("captura por cliente");
        } else {
          //se hace por cuenta
          this.captura_xcuenta = true;
          this.captura_xcliepoten = false;          
        }
        this.ptipomant = parametros["ptipomant"];
        this.cod_dcotiz = parametros["pcod_dcotiz"];
        this.num_dcotiz = parametros["pnum_dcotiz"];
        // console.log("ngoninit cotiza 1.3 ptipomant:" + this.ptipomant);
        // console.log("ngoninit cotiza 1.3 cod_dcotiz:" + this.cod_dcotiz);
        // console.log("ngoninit cotiza 1.3 num_dcotiz:" + this.num_dcotiz);
      }
      //ASEGURARSE DE TENER PARAMETROS diccionarios y objeto
      //UNA VEZ cargadiccionarios este llama a inicializacomponente
      this.cargadiccionarios("CRMCOTIZA");
    });
  }
  inicializacomponente(nsobjp, lcamposdic, lsegobj) {
    this.cargando = true;
    // console.log("inicializacomponente 1");
    // console.log(nsobjp);
    // console.log(lcamposdic);
    // console.log(lsegobj);
    
    this.message="";
    this.enerror=false;
    this.enlistaerror=false;
    this.grabo=false;
    this.inicializado=false;
    this.grabando=false;

    this.vglobal.rutaanterior = "";
    this.vglobal.titrutaanterior = "";
    this.vglobal.mostrarbreadcrumbs = true;
    this.valor_bruto = 0;
    this.valor_descuento = 0;
    this.valor_neto = 0;
    this.valor_iva = 0;
    this.valor_total = 0;
    this.condetalle = false;

    // this.title = nsobjp.titulo;
    // this.rutamant = nsobjp.rutamant;
    // this.paplica = nsobjp.aplica;
    // this.ptablab = nsobjp.tabla;
    // this.pcampollave = nsobjp.campollave;
    // this.pcamponombre = nsobjp.camponombre;
    // this.pclase_nbs = nsobjp.clase_nbs;
    // this.pclase_val = nsobjp.clase_val;
    this.tablaFormOrig = this.pf.group({});
    let lvar = "";
    // lvar = localStorage.getItem("DDT" + this.ptablab);
    // console.log("this.ptablab" + this.ptablab);
    // console.log(lvar);
    // console.log("inicializacomponente COTIZA 1.2");
    // this.camposform = JSON.parse(lvar);
    this.camposform = lcamposdic;
    // console.log(this.camposform);
    for (var litemobj of this.camposform) {
      // console.log("inicializacomponente COTIZA 1.2.1");
      // Crear campo formulario con valor por default
      let vardefa: any;
      if (litemobj.type == "text" && litemobj.val_defaul.length != 0) {
        var strvd = litemobj.val_defaul.toUpperCase();
        if (
          strvd.substring(0, 5) != "OAPP." &&
          strvd.substring(0, 9) != "THISFORM."
        ) {
          vardefa = eval(litemobj.val_defaul);
        } else {
          vardefa = "";
        }
      } else if (
        litemobj.type == "checkbox" &&
        litemobj.val_defaul.length != 0
      ) {
        (vardefa = litemobj.val_defaul == "true"), true, false;
      }
      let lcampformctrl = new FormControl(vardefa);
      //adicionar validacion si es obligatorio
      var avalida = [];
      if (litemobj.mensaje_er.length == 0) {
        litemobj.mensaje_er = "Valor Invalido";
      }
      //en este caso solo los de usuario los otros se definen por programa
      if (litemobj.obliga && litemobj.creado) {
        avalida.push(Validators.required);
        //   lcampformctrl.setValidators([Validators.required])
      }
      if (litemobj.type == "text" && litemobj.longitud > 0) {
        avalida.push(Validators.maxLength(litemobj.longitud));
      }
      if (avalida.length > 0) {
        lcampformctrl.setValidators(avalida);
      }
      let lvart: any;
      // console.log("inicializacomponente 3.1 this.varParam:"+this.varParam);
      lvart = localStorage.getItem(this.varParam);
      // console.log("inicializacomponente 3.2 lvart");
      // console.log(lvart);
      let lobjpar = JSON.parse(lvart);
      // console.log("inicializacomponente 3.3 lobjpar");
      // console.log(NetsolinApp.objpartablabas);
      // console.log(lobjpar);

      if (this.ptipomant != "A") {
        // console.log("inicializacomponente 3.4 lobjpar");
        if (!litemobj.per_adicionar && litemobj.type != "solcombog") {
          // console.log('disable a0');
          //se quita el disable cuando no es automatico manejarlo manual
          // lcampformctrl.disable();
        }
      } else {
        //Se debe deshabilitar si no permite modificar o es campo llave
        // console.log("litemobj editar");
        // console.log(litemobj);
        // console.log("inicializacomponente 4 lobjpar");
        // console.log(lobjpar);
        var acllave = lobjpar.campollave.split(",");
        // console.log("inicializacomponente 5");
        if (acllave.length > 1) {
          // console.log("litemobj editar 1");
          if (
            (!litemobj.per_adicionar ||
              acllave[0] == litemobj.name ||
              acllave[1] == litemobj.name) &&
            litemobj.type != "solcombog"
          ) {
            // console.log("litemobj disable 1 "+litemobj.name);
            //se quita el disable cuando no es automatico manejarlo manual
            // lcampformctrl.disable();
          }
        } else {
          // console.log("litemobj editar 2");
          if (
            (!litemobj.per_modificar || lobjpar.campollave == litemobj.name) &&
            litemobj.type != "solcombog"
          ) {
            // console.log("litemobj disable 2 "+litemobj.name);
            //se quita el disable cuando no es automatico manejarlo manual
            //  lcampformctrl.disable();
          }
        }
      }
      this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
    }
    // console.log("ngoninit cuentas 1.3");
    this.tablaForm = this.tablaFormOrig;
    // this.onChanges();
    if (this.ptipomant == "A") {
      // console.log("cotiza ini por adicion");
      this.estadograbacotiz = "B0";
      this.vglobal.titulopag =
        "Cotización: (Nuevo) Borrador" +
        " " +
        this.cod_dcotiz +
        "/" +
        this.num_dcotiz;

      this.inicializaFormadi();
    } else {
      // console.log("cotiza ini por moni");
      // console.log(this.cod_dcotiz + "|" + this.num_dcotiz);
      // console.log(this.ptablab);
      // console.log(this.pcampollave);
      // console.log();
      // console.log();
      this.mantbasicaService.getregTabla(this.cod_dcotiz + "|" + this.num_dcotiz,this.ptablab,this.paplica,this.pcampollave,this.pclase_nbs,this.pclase_val,this.pcamponombre).subscribe(
          regTabla => {
            // console.log("cotiza ini por moni 1");
            var result0 = regTabla[0];
            if (typeof result0 != "undefined") {
              // console.log("cotiza ini por moni 2");
              this.enlistaerror = true;
              this.listaerrores = regTabla;
            } else {
              // console.log("cotiza ini por moni 3 a asignavalores");
              this.asignaValores(regTabla);
            }
          },
          error => {
            this.showError(error);
          }
        );
    }
    //  console.log('Formulario despues de init:');
    //  console.log(this.tablaForm);
  }
  asignaValores(preg: any) {
    // console.log("cotiza ini por moni en asigna valores");
    // console.log(preg);
    this.cargando = true;
    // this.resultados = false;
    this.idccotiza = preg.id_cotiza;
    this.filtrocotizad = "id_cotiza=" + preg.id_cotiza;
    this.filtroactividades = "cod_doca='"+preg.cod_dcotiz+"' and num_doca='"+preg.num_dcotiz+"'";
    // console.log('cambio filtrocotizad en asignavalores:'+this.filtrocotizad);
    this.libmantab.asignaValoresform(preg,this.tablaForm,this.camposform,false);
    this.inicializaFormmoni(preg);
  }
  inicializaFormmoni(preg: any) {
    // console.log("cotiza ini por moni en inicializaFormmoni 1 preg:");
    // console.log(preg);
    var lcontrol: any;
    var avalida = [];
    var avalidanumero = [];    
    var lcontrol: any;
    lcontrol = this.tablaForm.get("estado_c");
    this.estado_c=lcontrol.value;    
    if (lcontrol.value != "G" && lcontrol.value != "P" && lcontrol.value != "C") {
      this.cerrada = false;
    } else {
      this.cerrada = true;
    }

    lcontrol = this.tablaForm.get("est_cap");
    if (lcontrol.value == "B") {
      this.estadograbacotiz = "B1";
      this.vglobal.titulopag ="Cotización: Borrador" + " " + this.cod_dcotiz + "/" + this.num_dcotiz+' Versión: '+preg.id_version;
    } else if (lcontrol.value === "D") {     
      this.estadograbacotiz = "D";
        if (preg.estado_c=='P') {
          this.vglobal.titulopag ="Cotización:" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+preg.id_version+ ' PERDIDA';
        } else {
          if (preg.estado_c=='G') {
            this.vglobal.titulopag ="Cotización:" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+preg.id_version+ ' GANADA';
            if (preg.num_dpedid != ''){
              this.linkmonipedido="EjeConsultaLis.wss?VRCod_obj=MONIDOCVENPEDIDO&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_DPEDID='"+preg.cod_dpedid+"',PVXINUM_DPEDID='"+preg.num_dpedid+"',PVXIFECHA=''"
              this.numpedido=preg.cod_dpedid+"/"+preg.num_dpedid;
            } else {
              this.linkmonipedido="";
              this.numpedido=""
            }
          } else {
            if (preg.estado_c=='C') {
              this.vglobal.titulopag ="Cotización:" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+preg.id_version+ ' CANCELADA';
            } else {
              this.vglobal.titulopag ="Cotización definitiva: " + " " + this.cod_dcotiz + "/" + this.num_dcotiz+' Versión: '+preg.id_version;
            }
          }
      }            
    }
    lcontrol = this.tablaForm.get("cod_tercer");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    lcontrol._updateOn = "blur";
    lcontrol = this.tablaForm.get("cod_procve");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    lcontrol._updateOn = "blur";
    avalida.push(Validators.required);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_procve", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_mone", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "id_contacto", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_ciudad", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_zona", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_vended", avalida);
    // this.libmantab.defineValidaCampo(this.tablaForm, 'lista_prec', avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_fpago", avalida);
    if (preg.id_cuentacrm>0){
      this.captura_xcliepoten = false;
      this.captura_xcuenta = true;
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_tercer", avalida);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cuentacrm", avalida);
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_cliepote", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cliepote", []);
      this.disableid_cliepote = true;
      this.disableid_cuentacrm = false;
      this.libmantab.disableCampoform(this.tablaForm, "cod_cliepote");
      this.libmantab.disableCampoform(this.tablaForm, "id_cliepote");      
    } else 
    if (preg.id_cliepote>0){
      this.captura_xcliepoten = true;
      this.captura_xcuenta = false;
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_tercer", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cuentacrm", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_cliepote", avalida);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cliepote", avalida);
      this.disableid_cliepote = false;
      this.disableid_cuentacrm = true;
      this.libmantab.disableCampoform(this.tablaForm, "cod_tercer");
      this.libmantab.disableCampoform(this.tablaForm, "id_cuentacrm");      
      
    }
  // definir validaciones campos númericos
  avalidanumero.push(Validators.min(0));
  avalidanumero.push(Validators.max(360));
  this.libmantab.defineValidaCampo(this.tablaForm, "tmp_entreg", avalidanumero);
  avalidanumero = [];
  avalidanumero.push(Validators.min(0));
  avalidanumero.push(Validators.max(900));
  this.libmantab.defineValidaCampo(this.tablaForm, "garantia", avalidanumero);
    
  avalidanumero = [];
  avalidanumero.push(Validators.min(0));
  avalidanumero.push(Validators.max(360));
  this.libmantab.defineValidaCampo(this.tablaForm, "val_oferta", avalidanumero);

    // console.log("cotiza ini por moni en inicializaFormmoni 2");

    this.inicializado = true;
    this.cargando = false;
    this.cargocliente = false;
    this.cargocliepoten = false;
    this.cargocontacto = false;
    this.cargocuenta = false;
    this.cargoprocven = false;
    this.grabo = false;
    this.message = "";
    this.pidcliepote = preg.id_cliepote;
    this.pidcuentacrm = preg.id_cuentacrm;
    if (this.captura_xcuenta) {
      this.validacuenta(this.pidcuentacrm, "id");
    } else if (this.captura_xcliepoten) {
      this.validacliepote(this.pidcliepote, "id");
    }
    //actualizar procedimiento venta para que cargue campos
    this.verComboprocven(preg.cod_procve, 'cod_procve', 'cod_procve');
    // console.log("a desable campos 1");
    lcontrol = this.tablaForm.get("est_cap");
    if (lcontrol.value === "D") {
      // console.log("a desable campos 2 por ser D");
      //desabilitar todos los campos no se puede modificar
      for (var litemobj of this.camposform) {
        // console.log("a desable campos litemobj.name:"+litemobj.name);
        this.libmantab.disableCampoform(this.tablaForm,litemobj.name);
     }  
    } else {
      // this.resultados = true;
      this.onChanges();
    }
  }
  //Inicializar el formulario con valores por defecto y validaciones adicionales a los que vienen del diccionario
  inicializaFormadi() {
    // console.log("ngoninit cuentas 1.3 inicializaform 1");
    var lcontrol: any;
    var avalida = [];
    var avalidanumero = [];
    // console.log(this.tablaForm);
    lcontrol = this.tablaForm.get("cod_tercer");
    // console.log("ngoninit cuentas 1.3 inicializaform 2");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    lcontrol._updateOn = "blur";
    avalida.push(Validators.required);
    if (this.captura_xcuenta) {
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_tercer", avalida);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cuentacrm", avalida);
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_cliepote", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cliepote", []);
      this.disableid_cliepote = true;
      this.disableid_cuentacrm = false;
      this.libmantab.disableCampoform(this.tablaForm, "cod_cliepote");
      this.libmantab.disableCampoform(this.tablaForm, "id_cliepote");
    } else if (this.captura_xcliepoten) {
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_tercer", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cuentacrm", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_cliepote", avalida);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cliepote", avalida);
      // console.log("por cliente poten . sinb validacion ");

      this.disableid_cliepote = false;
      this.libmantab.disableCampoform(this.tablaForm, "cod_tercer");
      this.libmantab.disableCampoform(this.tablaForm, "id_cuentacrm");
      this.disableid_cuentacrm = true;
    } else {
      // console.log("ni por cliente poten ni por cuenta. sinb validacion");
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_tercer", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cuentacrm", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "cod_cliepote", []);
      this.libmantab.defineValidaCampo(this.tablaForm, "id_cliepote", []);
      this.disableid_cliepote = false;
      this.disableid_cuentacrm = false;
    }

    // //como es el mismo para otros requeridos unicamente se llama con mismo arreglao avalida
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_procve", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_mone", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "id_contacto", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_ciudad", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_zona", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_vended", avalida);
    // this.libmantab.defineValidaCampo(this.tablaForm, 'lista_prec', avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_fpago", avalida);
//definir validaciones campos númericos
    avalidanumero.push(Validators.min(0));
    avalidanumero.push(Validators.max(360));
    this.libmantab.defineValidaCampo(this.tablaForm, "tmp_entreg", avalidanumero);
    avalidanumero = [];
    avalidanumero.push(Validators.min(0));
    avalidanumero.push(Validators.max(900));
    this.libmantab.defineValidaCampo(this.tablaForm, "garantia", avalidanumero);
        
    avalidanumero = [];
    avalidanumero.push(Validators.min(1));
    avalidanumero.push(Validators.max(360));
    this.libmantab.defineValidaCampo(this.tablaForm, "val_oferta", avalidanumero);

    //Si viene cuenta o cliente potencial y esta adicionando asignar el dato
    // console.log("cotiza inicializa 1");
    // console.log(this.ptipomant);
    // console.log(typeof (this.pidcuentacrm));
    // console.log(this.pidcuentacrm);
    // console.log(typeof (this.pidcliepote));
    // console.log(this.pidcliepote);
    if (this.ptipomant == "A" && (this.pidcuentacrm >= 0 || this.pidcliepote >= 0)) {
      // console.log("cotiza inicializa 1.1");
      this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",this.pidcuentacrm);
      // console.log("cotiza inicializa 1.2 asigna id_cliepote:"+this.pidcliepote);
      this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",this.pidcliepote);
      this.libmantab.asignaValorcampoform(this.tablaForm, "est_cap", "B");
      this.libmantab.asignaValorcampoform(this.tablaForm, "estado_c", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "estado", "");
      this.libmantab.asignaValorcampoform(this.tablaForm,"modulo_ori","COTICRM");
      this.libmantab.asignaValorcampoform(this.tablaForm, "proyecto", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "notas", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "centro", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "subcentro", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "tmp_entreg", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "garantia", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "tmp_entreg", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "val_oferta", 30);
      this.libmantab.asignaValorcampoform(this.tablaForm, "inc_iva", true);
      var numdocint = Math.floor(Math.random() * 99999999);
      this.num_dcotiz = numdocint.toString();
      this.filtrocotizad = "id_cotiza=" + numdocint.toString();
      this.estadograbacotiz = "B0";
      this.vglobal.titulopag ="Cotización: (Nuevo) Borrador" +" " +this.cod_dcotiz +"/" +this.num_dcotiz;
      this.libmantab.asignaValorcampoform(this.tablaForm,"num_dcotiz",this.num_dcotiz);
      // console.log("asigno cod y num cotiza");
      // console.log(this.cod_dcotiz);
      // console.log(this.num_dcotiz);
      // console.log(this.tablaForm);
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_procve", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_lista", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_mone", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "id_version", "1");
      this.libmantab.asignaValorcampoform(this.tablaForm, "fletes", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "garantia", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "seguros", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "tasa_cambi", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "tmp_entreg", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "val_oferta", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "valor_brut", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "valor_neto", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "iva", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "otros", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "descuento", 0);
      this.libmantab.asignaValorcampoform(this.tablaForm, "anticipos", 0);
      var vfecha = new Date().toJSON().slice(0, 10);
      this.libmantab.asignaValorcampoform(this.tablaForm, "fec_dcotiz", vfecha);
      //dependiendo de si viene por cliente potencial o por cuenta validar este
      this.cargocliente = false;
      this.cargocliepoten = false;
      this.cargocontacto = false;
      this.cargocuenta = false;
      this.cargoprocven = false;
      this.grabo = false;
      this.message = "";
      // console.log('ini adi 10 this.captura_xcuenta:'+this.captura_xcuenta);
      if (this.captura_xcuenta) {
        // console.log('ini adi 11 a valida cuednta');
        this.validacuenta(this.pidcuentacrm, "id");
      } else if (this.captura_xcliepoten) {
        // console.log('ini adi 11 a valida cliente');
        this.validacliepote(this.pidcliepote, "id");
      }

      // console.log("cotiza inicializa 1.3");
    }
    // console.log("cotiza inicializa 2");

    //para campos nombres y apellidos limpiar validadores y asignar blanco
    // console.log("ngoninit cuentas 1.3 inicializaform 3");
    // this.libmantab.asignaValorcampoform(this.tablaForm, "cod_ciudad", "11001");

    this.inicializado = true;
    this.cargando = false;
    this.onChanges();
  }
  //Si cambia el codigo llenar el campo estado a Nuevo
  onChanges(): void {
    this.tablaForm.get("cod_tercer").valueChanges.subscribe(val => {
      // console.log("onChanges en cod_tercer val:" + val);
      var lcontrol: any;
      lcontrol = this.tablaForm.get("cod_tercer");
      // console.log('onChanges en cod_tercer 2 val:'+val)
      if (lcontrol.value) {
        // console.log("set val lleno: "+lcontrol.value);
        // console.log('onChanges en cod_tercer 3 val:'+val)
        this.validacuenta(val, "cod");
      } else {
        // lcontrol.setValue(0);
      }
    });

    this.tablaForm.get("cod_cliepote").valueChanges.subscribe(val => {
      // console.log("onChanges en cod_cliepote val:" + val);
      var lcontrol: any;
      lcontrol = this.tablaForm.get("cod_cliepote");
      // console.log('onChanges en cod_tercer 2 val:'+val)
      if (lcontrol.value) {
        // console.log("set val lleno: "+lcontrol.value);
        // console.log('onChanges en cod_tercer 3 val:'+val)
        this.validacliepote(val, "cod");
      } else {
        // lcontrol.setValue(0);
      }
    });

    // this.tablaForm.get('cod_tercer').valueChanges.subscribe(val => {
    //   var lcontrol: any;
    //   lcontrol = this.tablaForm.get('estado');
    //   if (lcontrol.value) {
    //     // console.log("set val lleno: "+lcontrol.value);
    //   }
    //   else {
    //     lcontrol.setValue('0');
    //   }
    // });
  }
  refrescaSeguimiento(regDeta) {
    // console.log('llega refresca refrescaSeguimiento reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
  }
  refrescaArchivos(regDeta) {
    // console.log('llega refresca refrescaArchivos reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
  }
  refrescaTotalesdeta(regDeta) {
    // console.log('llega refresca totales reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
    this.valor_bruto = 0;
    this.valor_descuento = 0;
    this.valor_neto = 0;
    this.valor_iva = 0;
    this.valor_total = 0;
    this.condetalle = false;
    var litems:number=0;
    for (var litedeta of regDeta.regdeta) {
      litems++;
      // console.log('calculo item:');
      // console.log(litedeta);
      var lcantidad: number = litedeta.cantidad;
      var lvalunit: number = litedeta.valor_list;
      this.valor_bruto = this.valor_bruto + lcantidad*lvalunit;
      this.valor_descuento = this.valor_descuento + litedeta.descuento;
      this.valor_neto = this.valor_neto + litedeta.valor_neto;
      this.valor_iva = this.valor_iva + litedeta.iva;
      // console.log('calculo valor_neto:');
      // console.log(this.valor_neto);
    }
    this.valor_total = this.valor_neto + this.valor_iva
    if (litems>0){
      this.condetalle = true;      
    }
    // console.log('calculo valor_total:');
    // console.log(this.valor_total);
    this.tabstrip.selectTab(1);
  }
  onSubmit() {
    // console.log('onSubmit 1');
    this.message="";
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    // console.log('onSubmit 2');
    if (this.ptipomant==='A'){
       this.onSubmitAdicion();
    } else     if (this.ptipomant==='E'){
      this.onSubmitModifica();
   }

  }

  openactivar(){
    this.grabo = false;
    this.message="";
    this.enerror = false;
    this.ngmdescri_cierre="";
    this.dialogoactivar=true;
  }
  openimprimir(){
    this.grabo = false;
    this.message="";
    this.ngmdescri_cierre="";
    this.enerror = false;
          //carga formas impresión
          this.service.getNetsolinObjbusqueda("BUSMULFORMACRM", "cod_docume='"+this.cod_dcotiz+"'", "")
          .subscribe(
            result => {
              // console.log("cotizagetListadropdown mulformas 1");
              // console.log(result);
              var result0 = result[0];
              // console.log(result0);
              if (typeof result.isCallbackError != "undefined") {
                console.log("cotizagetListadropdown mulformas 2");
                this.enlistaerror = true;
                this.listaerrores = result.messages;        
              } else {
                this.listaformas = result;
                this.dialogoimprimir=true;
                console.log("cotizagetListadropdown mulformas 3");
            }
            },
            error => {
              this.showError(error);
            }
          );

    this.dialogoimprimir=true;
  }
  openrevisar(){
    this.grabo = false;
    this.message="";
    this.enerror = false;
    this.ngmdescri_cierre="";
    this.dialogorevisar=true;
  }

  openconvsolped(){
    this.grabo = false;
    this.message="";
    this.cotvalagenped = false;
    this.menerrorvalagenped=[];      
    this.enerror = false;

    this.ngmdescri_cierre="";
          //Valida si se puede generar el pedido
          this.service.getNetsolinObjbusqueda("VALCOTAPEDIDO", "cod_dcotiz='"+this.cod_dcotiz+"' and num_dcotiz='"+this.num_dcotiz+"'", "")
          .subscribe(
            result => {
              // console.log("openconvsolped  1");
              // console.log(result);
              if (typeof result.isCallbackError != "undefined") {
                this.cotvalagenped = false;
                this.menerrorvalagenped=result.messages;      
              } else {
                this.cotvalagenped = true;
                this.menerrorvalagenped[0]="";                                  
                //cargar direcciones de despacho del cliente
          this.service.getNetsolinObjbusqueda("BUSDIRDESPACRM", "cod_tercer='"+this.tablaForm.value.cod_tercer+"'", "")
          .subscribe(
            result => {
              // console.log("cotizagetListadropdown mulformas 1");
              // console.log(result);
              var result0 = result[0];
              // console.log(result0);
              if (typeof result.isCallbackError != "undefined") {
                console.log("cotizagetListadropdown busdirec 2");
                this.enlistaerror = true;
                this.listaerrores = result.messages;        
              } else {
                this.listadirdespa = result;
                console.log("cotizagetListadropdown busdirec 3");
            }
            },
            error => {
              this.showError(error);
            }
          );
                
            }
            },
            error => {
              this.cotvalagenped = false;
              this.menerrorvalagenped=error;      
            // this.showError(error);
            }
          );
    this.dialogoconvsolped=true;
  }



  opencerrar(){
    this.grabo = false;
    this.message="";
    this.enerror = false;
    this.enerrormodal=false;
    this.ngmdescri_cierre="";
    //carga causales de perdida
    this.mantbasicaService.getListadropdown("*","CAUSAL_PERD","2",21,"CRMCAUSPERD","").subscribe(
      result => {
        // console.log("cotizagetListadropdown causales 1");
        // console.log(result);
        var result0 = result[0];
        if (typeof result.isCallbackError != "undefined") {
          // console.log("cotizagetListadropdown causales 2");
          this.enlistaerror = true;
          this.enerrormodal = true;
          this.listaerrores = result.messages;        
        } else {
          this.listacausalesperd = result;
          //carga competidores
          this.mantbasicaService.getListadropdown("*","COMPETENCIA","2",21,"CRMCOMPET01","").subscribe(
            result => {
              // console.log("cotizagetListadropdown COMPETENCIA 1");
              // console.log(result);
              var result0 = result[0];
              if (typeof result.isCallbackError != "undefined") {
                  // console.log("cotizagetListadropdown COMPETENCIA 2");
                  this.enerrormodal = true;
                  this.enlistaerror = true;
                  this.listaerrores = result.messages;        
              } else {
                  this.listacompetidores = result;
                  this.dialogocerrar=true;
                  // console.log("cotizagetListadropdown COMPETENCIA 3");
                  this.menerrorvalagenped=[];   
                  this.cotvalagenped = false;   
                        //Valida si se puede generar el pedido
                        this.service.getNetsolinObjbusqueda("VALCOTAPEDIDO", "cod_dcotiz='"+this.cod_dcotiz+"' and num_dcotiz='"+this.num_dcotiz+"'", "")
                        .subscribe(
                          result => {
                            // console.log("openconvsolped  1");
                            // console.log(result);
                            if (typeof result.isCallbackError != "undefined") {
                              this.cotvalagenped = false;
                              this.menerrorvalagenped=result.messages;      
                            } else {
                              this.cotvalagenped = true;
                              this.menerrorvalagenped[0]="";                                  
                          }
                          },
                          error => {
                            this.cotvalagenped = false;
                            this.menerrorvalagenped=error;      
                          // this.showError(error);
                          }
                        );           

                }
          },
          error => {
            this.showError(error);
          }
        );
          // console.log("cotizagetListadropdown causales 3");
        }
      },
      error => {
        this.showError(error);
      }
    );
    
  }

  // onSubmitdefprue(){
  //    console.log('llamar graba modifica como definitivo: genfichatecnica:'+this.genfichatecnica)
  //    this.libmantab.asignaValorcampoform(this.tablaForm,"env_fichatec",this.genfichatecnica);
  //     this.dialogoactivar=false;
  // }

  onSubmitimprimir(){
    this.message="";
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    //cambiar ctrl_apli a 'I' de revisar para parametro al grabar que le indique que solo IMPRIMIR
    this.regTabla.est_cap = 'D';
    this.regTabla.ctrl_apli = 'I';
    this.regTabla.env_fichatec = this.genfichatecnica;
    this.regTabla.cod_forma=this.selectedformas.id;
    // console.log('Registro a imprimir:');
    // console.log(this.regTabla);
    
    this.dialogoimprimir=false;
    this.onSubmitModifica();    
  }
  onSubmitdef(){
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.grabando = true;
    this.libmantab.asignaValorcampoform(this.tablaForm,"env_fichatec",this.genfichatecnica);
    console.log('this.tablaForm Antes de saveregtabla');
    console.log(this.tablaForm);
    console.log('this.regTabla Antes de saveregtabla');
    console.log(this.regTabla);
    this.regTabla = this.saveregTabla();
    console.log('this.regTabla DEspues el que va a grabar de saveregtabla');
    console.log(this.regTabla);

    //cambiar est_cap a D definitiva 
    this.regTabla.est_cap = 'D';
    this.regTabla.ctrl_apli = '';
    // this.regTabla.env_fichatec = this.genfichatecnica;
    this.dialogoactivar=false;
    this.onSubmitModifica();
    
  }
  onSubmitrevisar(){
    this.message="";
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    //cambiar ctrl_apli a 'R' de revisar para parametro al grabar que le indique que solo cambie estado
    this.regTabla.est_cap = 'D';
    this.regTabla.ctrl_apli = 'R';
    // console.log('revisar');
    this.regTabla.descri_cierre=this.ngmdescri_cierre;
    // console.log('Registro a grbar:');
    // console.log(this.regTabla);
    this.dialogorevisar=false;
     this.onSubmitModifica();
  }

  onSubmitconvsolped(){
    this.message="";
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    //cambiar ctrl_apli a 'R' de revisar para parametro al grabar que le indique que solo cambie estado
    this.regTabla.est_cap = 'D';
    //P convertir a sol pedido
    this.regTabla.ctrl_apli = 'P';
    // console.log('revisar');
    this.regTabla.descri_cierre=this.ngmdescri_cierre;
    this.regTabla.id_dir=this.selecteddirdespa.id;
    // console.log('Registro a grbar:');
    // console.log(this.regTabla);
    this.dialogoconvsolped=false;
     this.onSubmitModifica();
  }
  
  validaCerrar(){
    // console.log('validaCerrar estado_c');
    // console.log(this.selectedEstado);
    // console.log(this.selectedEstado.value);
    // console.log(typeof(this.selectedcausalperd));
    if (this.selectedEstado.value=='P' && (typeof(this.selectedcausalperd) != "object")){
      this.menerrormodal = 'Debe seleccionar una causal de perdida';
      this.enerrormodal = true;
      return;
    }  if (this.selectedEstado.value=='G' && !this.cotvalagenped){
      this.menerrormodal = 'La cotización no es valida para cerrar como Ganada';
      this.enerrormodal = true;
      return;
    }  else {
      this.onSubmitdefcerrar();    
    }
  }

  onSubmitdefcerrar(){    
    this.message="";
    this.enerrormodal = false;
    this.menerrormodal= "";
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    //cambiar ctrl_apli a 'C' de cerrar para parametro al grabar que le indique que solo cambie estado
    this.regTabla.ctrl_apli = 'C';

    //cambiar est_cap a D definitiva 
    // console.log('cerrar estado_c');
    // console.log(this.selectedEstado);
    // console.log(this.selectedEstado.value);

    // console.log('cerrar id_causper');
    // console.log(this.selectedcausalperd);
    //cambiar dato a grabar de acuerdo a captura
    this.regTabla.estado_c = this.selectedEstado.value;
    if (this.regTabla.estado_c=='P'){
      this.regTabla.id_causper = this.selectedcausalperd.id;
      if (typeof(this.selectedcompetidor) == "object")
        this.regTabla.id_competen = this.selectedcompetidor.id;  
      else  
        this.regTabla.id_competen = 0;  
    } else {
      this.regTabla.id_causper = 0;
      this.regTabla.id_competen = 0;
    }
    this.regTabla.descri_cierre=this.ngmdescri_cierre;
    // console.log('Registro a grbar:');
    // console.log(this.regTabla);
    this.regTabla.est_cap = 'D';
    this.dialogocerrar=false;
    this.onSubmitModifica();
   
  }
  onSubmitModifica(){
    var idcondi: string;
    idcondi = this.cod_dcotiz+'|'+this.num_dcotiz;
    this.mantbasicaService
    .putregTabla(this.regTabla,idcondi,this.ptablab,this.paplica,this.pcampollave,this.pclase_nbs,this.pclase_val,this.pcamponombre).subscribe(
      newpro => {
        // console.log('onSubmit 3');
        var result0 = newpro[0];
        if (typeof newpro.isCallbackError != "undefined") {
          // console.log('onSubmit 4');
          this.grabando = false;          
          this.grabo = false;
          this.enlistaerror = true;
          this.listaerrores = newpro.messages;
        } else {
          this.grabando = false;          
          // console.log("onSubmit 5 grabo newpro:");
          // console.log(newpro);
          // console.log(result0);
          this.grabo = true;
          this.regTabla = result0;
          this.libmantab.asignaValoresform(result0,this.tablaForm,this.camposform,false);
          this.cod_dcotiz = result0.cod_dcotiz;
          this.num_dcotiz = result0.num_dcotiz;
          // this.estadograbacotiz = result0.est_cap;
          this.ptipomant='E';
          if ( result0.est_cap != 'D'){
            this.estadograbacotiz = "B1";
            this.vglobal.titulopag ="Cotización: Borrador" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+result0.id_version ;
            this.showMensaje("Se modifico cabecera.");
          } else {
            this.estadograbacotiz = "D";
            this.estado_c = result0.estado_c;
            if (result0.estado_c=='P') {
              this.vglobal.titulopag ="Cotización:" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+result0.id_version+ ' PERDIDA';
              this.router.navigate(['cotizacion','VARPARCOTIZACRM_C',0,0,result0.id_cuentacrm,'E',this.cod_dcotiz,this.num_dcotiz]);
              this.showMensaje("Se cerro como PERDIDA.");
              this.cerrada = true;
            } else {
              if (result0.estado_c=='G') {
                this.vglobal.titulopag ="Cotización:" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+result0.id_version+ ' GANADA';
                this.router.navigate(['cotizacion','VARPARCOTIZACRM_C',0,0,result0.id_cuentacrm,'E',this.cod_dcotiz,this.num_dcotiz]);
                if (result0.num_dpedid != ''){
                  this.linkmonipedido="EjeConsultaLis.wss?VRCod_obj=MONIDOCVENPEDIDO&VCAMPO=*E*&VCONDI=Especial&VTEXTO=PVXICOD_DPEDID='"+result0.cod_dpedid+"',PVXINUM_DPEDID='"+result0.num_dpedid+"',PVXIFECHA=''"
                  this.numpedido=result0.cod_dpedid+"/"+result0.num_dpedid;
                } else {
                  this.linkmonipedido="";
                  this.numpedido="";
                }
                this.showMensaje("Se cerro como GANADA.");
                this.cerrada = true;
              } else {
                if (result0.estado_c=='C') {
                  this.vglobal.titulopag ="Cotización:" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+result0.id_version+ ' CANCELADA';
                  this.router.navigate(['cotizacion','VARPARCOTIZACRM_C',0,0,result0.id_cuentacrm,'E',this.cod_dcotiz,this.num_dcotiz]);
                  this.showMensaje("Se cerro como CANCELADA.");
                  this.cerrada = true;
                } else {
                  this.vglobal.titulopag ="Cotización: Definitiva" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+result0.id_version;
                  this.showMensaje("Se modifico y quedo como definitiva. Para modificarla debe Ingresar por Revisar para cambiar la versón.");
                }
              }
            }
          }
          // this.tablaForm.reset();
        }
      },
      error => {
        this.grabando = false;          
        // console.log('onSubmit 6');
        this.grabo = false;
        this.showError(error);
      }
    );

  }

  onSubmitAdicion(){
    this.mantbasicaService.postregTabla(this.regTabla,this.ptablab,this.paplica,this.pcampollave,this.pclase_nbs,this.pclase_val,this.pcamponombre)
    .subscribe(
      newpro => {
        this.grabando = false;          
        // console.log('onSubmit 3');
        var result0 = newpro[0];
        if (typeof newpro.isCallbackError != "undefined") {
          // console.log('onSubmit 4');
          this.grabo = false;
          this.enlistaerror = true;
          this.listaerrores = newpro.messages;
        } else {
          // console.log("onSubmit 5 grabo newpro:");
          // console.log(newpro);
          // console.log(result0);
          this.grabo = true;
          this.enerror = false;
          this.enlistaerror = false;
          this.grabando = false;
          this.idccotiza = result0.id_cotiza;
          this.cod_dcotiz = result0.cod_dcotiz;
          this.num_dcotiz = result0.num_dcotiz;
          this.filtrocotizad = "id_cotiza=" + result0.id_cotiza;
          this.filtroactividades = "cod_doca='"+result0.cod_dcotiz+"' and num_doca='"+result0.num_dcotiz+"'";
      
          this.estadograbacotiz = "B1";
          this.vglobal.titulopag ="Cotización: Borrador" +" " +this.cod_dcotiz +"/" +this.num_dcotiz+' Versión: '+result0.id_version;
            this.ptipomant='E';
            // this.tablaForm.reset();
          this.showMensaje("Se creo como borrador.");
          // this.router.navigate(['cotizacion','VARPARCOTIZACRM_C',result0.id_version,result0.id_cuentacrm,result0.id_cliepote,'E',result0.cod_dcotiz,result0.num_dcotiz]);
          this.router.navigate(['cotizacion','VARPARCOTIZACRM_C',0,0,0,'E',result0.cod_dcotiz,result0.num_dcotiz]);
        }
      },
      error => {
        this.grabando = false;          
        // console.log('onSubmit 6');
        this.grabo = false;
        this.showError(error);
      }
    );

  }
  saveregTabla() {
    //hacer copia de form captura para grabar antes habilitar campos
    var tablaFormGraba: FormGroup;
    tablaFormGraba =   this.tablaForm;
    //activar todos los campos para que pase en la grabación
    for (var litemobj of this.camposform) {
      this.libmantab.enableCampoform(tablaFormGraba,litemobj.name);
   }
    const saveregTabla = tablaFormGraba.value;
    return saveregTabla;
    
  }
  retornaRuta() {
    // console.log(this.rutamant);
    return "/" + this.rutamant;
  }
  // message = new MensajeError;

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
  validacliepote(valor, ptipo) {
    //ptipo id: buscar id_cuentacrm solo al iniciar de resto trabaja con cod cod_tercer
    //se valida por codigo de cliente y se guarda codigo y id
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    var lvalorn: any;
    var lncampon: string;
    var lcliepotenant: string;
    var lcambiadatocliepot = false;
    var lcampobusca: string;
    lvalor = valor;
    this.enerror=false;
    this.message="";
    if (this.captura_xcuenta) return;

    // console.log("validacliepote 1 valor:" + valor);
    lcontrolcampo = this.tablaForm.controls["cod_cliepote"];
    // console.log("validacliepote 2");
    //guardar tercero antes cambio para saber si cambio y cambia datos relacionados
    // lcliepotenant = lcontrolcampo.value;
    lcliepotenant = this.codcliepoteant;
    // console.log("validacliepote 3");
    if (ptipo === "id") {
      lcampobusca = "id_cliepote";
    } else {
      lcampobusca = "cod_cliepote";
    }
    // console.log("validacliepote 2.1 lcampobusca:" + lcampobusca);
    // console.log("validacliepote 2.1 this.cargando:" + this.cargando);

    if (lvalor != lcliepotenant || this.cargando) {
      // console.log("verCombocod_tercer Cambiar datos");
      lcambiadatocliepot = true;
    }
    //traer el tercero
    this.cargocliepoten = false;
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService.getregTabla(lvalor,"CLIENPOTEN","21",lcampobusca,"","","nom_empre")
        .subscribe(regTabla => {
          // console.log("llega sus validacliepote");
          // console.log(typeof regTabla);
          // console.log(regTabla);
          if (typeof regTabla.isCallbackError == "undefined") {
            if (regTabla.id_cuenta>0){
              // console.log("llega sus validacliepote 2 error");
              this.showError('El cliente potencial ya es cuenta. Seleccionelo por cuenta');
              this.libmantab.asignaValorcampoform(this.tablaForm,"cod_cliepote","");
              if (typeof(this.txtcod_cliepote) !='undefined'){
                // this.txtcod_cliepote.inputbus.nativeElement.value = '';
                // this.renderer.setValue(this.txtcod_cliepote.inputbus.nativeElement,''); 
                this.renderer.setValue(this.txtcod_cliepote,''); 
              }
              return;                
            }
            // console.log("llega sus validacliepote 3");
            this.regCliepoten = regTabla;
            // console.log(this.regCliepoten);
            this.id_cliepoten = this.regCliepoten.id_cliepote;
            // console.log("validacliepote a2");
            this.filtrocontacto = "id_cliepote=" + this.id_cliepoten;
            if (typeof(this.txtcod_cliepote) !='undefined'){
              // this.txtcod_cliepote.inputbus.nativeElement.value = this.regCliepoten.cod_cliepote;
              this.renderer.setValue(this.txtcod_cliepote,this.regCliepoten.cod_cliepote); 
            }
            // console.log("llega sus validacliepote 4");
            // console.log("valida validacliepote this.filtrocontacto:" + this.filtrocontacto);
            this.labelcliepote = this.regCliepoten.nom_empre;
            this.labelcuenta = "";

            //desabilitar y quitar validacion a cuenta
            if (!this.captura_xcliepoten) {
              // console.log("llega sus validacliepote 5");
              this.captura_xcuenta = false;
              this.captura_xcliepoten = true;
              this.disableid_cliepote = false;
              var avalida = [];
              avalida.push(Validators.required);
              this.libmantab.defineValidaCampo(this.tablaForm,"cod_cliepote",avalida);
              this.libmantab.defineValidaCampo(this.tablaForm,"id_cliepote",avalida);
              this.libmantab.defineValidaCampo(this.tablaForm,"cod_tercer",[]);
              this.libmantab.defineValidaCampo(this.tablaForm,"id_cuentacrm",[]);
              // console.log(
              //   "cambio avalida de cliente potencial para que nolo pida"
              // );
            }

            this.captura_xcliepoten = true;
            console.log("llega sus validacliepote 6");

            // console.log("validacuenta 2");
            // console.log(this.regCliepoten);
            //cambiar solo si esta vacio o no definido usar asignaValorcampoformsindato de lo contrario asignaValorcampoform
            // this.libmantab.asignaValorcampoform(this.tablaForm, "nombre", this.regTercero.nombre)
            if (lcambiadatocliepot) {
              // console.log("llega sus validacliepote 7");
              // console.log("validacliepote a3");
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"id_contacto",this.regCliepoten.id_contprin);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_ciudad",this.regCliepoten.cod_ciudad);
              this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",this.regCliepoten.id_cliepote);
              this.libmantab.asignaValorcampoform(this.tablaForm,"cod_cliepote",this.regCliepoten.cod_cliepote);
              //this.libmantab.asignaValorcampoform(this.tablaForm,"cod_vended",NetsolinApp.oapp.cuserid);
              //actualiza anterior
              this.codcliepoteant = this.regCliepoten.cod_cliepote;
              this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",0);
              this.libmantab.asignaValorcampoform(this.tablaForm,"cod_tercer","");
              if (typeof(this.txtcod_tercer) !='undefined'){
                // this.txtcod_tercer.inputbus.nativeElement.value = '';
                this.renderer.setValue(this.txtcod_tercer,''); 
              }
              this.labelcuenta='';

            }
            console.log("llega sus validacliepote 8");
            // console.log("validacliepote a4");
            this.tabstrip.selectTab(0);
            // console.log('cargo cuenta form quedo:');
            // console.log(this.tablaForm);
            this.cargocliepoten = true;
          } else {
            // console.log("llega sus validacliepote 9");
            // console.log("llega con error no encontro limpiar");
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_cliepote","");
            if (typeof(this.txtcod_cliepote) !='undefined'){
              // this.txtcod_cliepote.inputbus.nativeElement.value = '';
              this.renderer.setValue(this.txtcod_cliepote,''); 
            }
          }
        });
    } else {
      // console.log("llega sus validacliepote 10");
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_cliepote", "");
      if (typeof(this.txtcod_cliepote) !='undefined'){
        // this.txtcod_cliepote.inputbus.nativeElement.value = '';
        this.renderer.setValue(this.txtcod_cliepote,''); 
      }
}
    // console.log("llega sus validacliepote 11");

  }
  validacuenta(valor, ptipo) {
    //ptipo id: buscar id_cuentacrm solo al iniciar de resto trabaja con cod cod_tercer
    //se valida por codigo de tercero y se guarda codigo y id
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    var lvalorn: any;
    var lncampon: string;
    var lcuentaant: string;
    var lcambiadatoscue = false;
    var lcampobusca: string;
    lvalor = valor;
    this.enerror=false;
    this.message="";
    // console.log("validacuenta 1 this.captura_xcliepoten:"+this.captura_xcliepoten);
    if (this.captura_xcliepoten) return;

    // console.log("validacuenta 1 valor:" + valor);
    lcontrolcampo = this.tablaForm.controls["cod_tercer"];
    // console.log("validacuenta 2");
    //guardar tercero antes cambio para saber si cambio y cambia datos relacionados
    // lcuentaant = lcontrolcampo.value;
    //se toma tercero anterior valido
    lcuentaant = this.codtercerant;
    // console.log("validacuenta 3");
    if (ptipo === "id") {
      lcampobusca = "id_cuentacrm";
    } else {
      lcampobusca = "cod_tercer";
    }
    // console.log("validacuenta 2.1 lcampobusca:" + lcampobusca);
    // console.log("validacuenta 2.1 this.cargando:" + this.cargando);
    // console.log("validacuenta 2.1 lvalor:" + lvalor);
    // console.log("validacuenta 2.1 lcuentaant:" + lcuentaant);

    if (lvalor != lcuentaant || this.cargando) {
      // console.log("validacuenta Cambiar datos");
      lcambiadatoscue = true;
    }
    //traer el tercero
    this.cargocuenta = false;
    // console.log("validacuenta ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService
        .getregTabla(lvalor, "CUENTACRM", "21", lcampobusca, "", "", "nombre")
        .subscribe(regTabla => {
          // console.log("llega sus cuenta");
          // console.log(typeof regTabla);
          // console.log(regTabla);
          if (typeof regTabla.isCallbackError == "undefined") {
            this.regCuenta = regTabla;
            this.cargocuenta = true;
            // console.log(this.regCuenta);
            this.id_cuentacrm = this.regCuenta.id_cuentacrm;
            // console.log(this.id_cuentacrm);
            console.log("validacuenta a2");
            this.filtrocontacto = "id_cuenta=" + this.id_cuentacrm;
            console.log("valida cuenta this.filtrocontacto:" + this.filtrocontacto);
            this.labelcuenta = this.regCuenta.nombre;
            // this.labelcliepote = "";
            //desabilitar y quitar validacion a client potencial
            if (!this.captura_xcuenta) {
              this.captura_xcuenta = true;
              this.captura_xcliepoten = false;
              this.disableid_cliepote = true;
              var avalida = [];
              avalida.push(Validators.required);
              this.libmantab.defineValidaCampo(this.tablaForm,"cod_tercer",avalida);
              this.libmantab.defineValidaCampo(this.tablaForm,"id_cliepote",[]);
              // console.log(
              //   "cambio avalida de cliente potencial para que nolo pida"
              // );
            }

            this.captura_xcuenta = true;

            // console.log("validacuenta 2");
            // console.log(this.regCuenta);
            //cambiar solo si esta vacio o no definido usar asignaValorcampoformsindato de lo contrario asignaValorcampoform
            // this.libmantab.asignaValorcampoform(this.tablaForm, "nombre", this.regTercero.nombre)
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_ciudad",this.regCuenta.cod_ciudad);
            // console.log('txtcod_tercer');
            // console.log(this.txtcod_tercer);
            if (typeof(this.txtcod_tercer) !='undefined'){
              // this.txtcod_tercer.inputbus.nativeElement.value = this.regCuenta.cod_tercer;
              this.renderer.setValue(this.txtcod_tercer,this.regCuenta.cod_tercer); 

            }
            if (lcambiadatoscue) {
              // console.log("validacuenta a3");
              this.libmantab.asignaValorcampoform(this.tablaForm,"id_contacto",this.regCuenta.id_contapri);
              this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",this.regCuenta.id_cliepote);
              this.libmantab.asignaValorcampoform(this.tablaForm,"cod_cliepote",'');
              //buscar y asignar cliente potencial si lo tiene
              // console.log("validacuenta a4 bus clie poten ");
              // console.log(this.regCuenta.id_cliepote);
              if (this.regCuenta.id_cliepote>0){
              this.mantbasicaService.getregTabla(this.regCuenta.id_cliepote,"CLIENPOTEN","21","id_cliepote","","","nom_empre")
              .subscribe(regTabla => {
                // console.log("validacuenta a4 bus clie poten 2");
                // console.log("llega sus validacliepote");
                // console.log(regTabla);
                if (typeof regTabla.isCallbackError == "undefined") {
                  // console.log("validacuenta a4 bus clie poten 3 ");
                  this.libmantab.asignaValorcampoform(this.tablaForm,"cod_cliepote",regTabla.cod_cliepote);
                  if (typeof(this.txtcod_cliepote) !='undefined'){
                    // this.txtcod_cliepote.inputbus.nativeElement.value = regTabla.cod_cliepote;
                    this.renderer.setValue(this.txtcod_cliepote,regTabla.cod_cliepote); 

                  }
                  // console.log("validacuenta a4 bus clie poten 5 ");
                  this.labelcliepote = regTabla.nom_empre;
                } else {
                  // console.log("validacuenta a4 bus clie poten 6 ");
                  this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",0);
                  this.libmantab.asignaValorcampoform(this.tablaForm,"cod_cliepote",'');
                  this.labelcliepote = "";
                  if (typeof(this.txtcod_cliepote) !='undefined'){
                    // this.txtcod_cliepote.inputbus.nativeElement.value = '';
                    this.renderer.setValue(this.txtcod_cliepote,''); 
                  }
                }
              });                               
            } else{
              this.libmantab.asignaValorcampoform(this.tablaForm,"cod_cliepote",'');
              this.labelcliepote = "";          
              if (typeof(this.txtcod_cliepote) !='undefined'){
                // this.txtcod_cliepote.inputbus.nativeElement.value = '';
                this.renderer.setValue(this.txtcod_cliepote,''); 
              }
        }

              // console.log("validacuenta a4 bus clie poten 7 salio de clie poten ");
              this.pidcliepote = this.regCuenta.id_cliepote;
              this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",this.regCuenta.id_cuentacrm);
              this.libmantab.asignaValorcampoform(this.tablaForm,"cod_tercer",this.regCuenta.cod_tercer);
              //actualizar nueva valor del tercero anterior
              this.codtercerant = this.regCuenta.cod_tercer;
              // this.cargocontacto=false;
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "nombre", this.regTercero.nombre)
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "url_empre", this.regTercero.homepage)
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "cod_pais", this.regTercero.cod_pais)
              this.libmantab.asignaValorcampoform(this.tablaForm,"cod_ciudad",this.regCuenta.cod_ciudad);
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "cod_acteic", this.regTercero.cod_acteic)
              // console.log('vercombocod_tercer ccombociudad');
              // console.log(this.ccombociudad);
              // this.ccombociudad.toggle(true);
              // this.ccombociudad.open('169');
              // this.ccombociudad.valini='169';
              // this.ccombociudad.selectionChange('169');
              // lcontrolcampo = this.tablaForm.controls["cod_ciudad"];
              // lcontrolcampo.setValue(this.regTercero.cod_ciudad);
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "telefono", this.regTercero.telefono)
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "direccion", this.regTercero.direccion)
            }
            // console.log("validacuenta a4");
            // this.inicializado = true;
            //cargar cliente
            this.cargocliente = false;
            this.mantbasicaService
              .getregTabla(this.regCuenta.cod_tercer,"CLIENTES","21","cod_tercer","","","contacto")
               .subscribe(regTabla => {
                // console.log("validacuenta a5 cliente");
                if (typeof regTabla != "undefined") {
                  this.regCliente = regTabla;
                  // console.log("verCombocod_tercer ant regCliente:");
                  // console.log(this.regCliente);
                  //cargar cliente
                  if (lcambiadatoscue) {   
                    //Asignar el usuario que esta creando                  
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_vended",this.regCliente.cod_vended);
                    // this.libmantab.asignaValorcampoform(this.tablaForm,"cod_vended",NetsolinApp.oapp.cuserid);
                    this.libmantab.asignaValorcampoform(this.tablaForm,"cod_zona",this.regCliente.cod_zona);
                    // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "cupo_credi", this.regCliente.cupo_credi)
                    this.libmantab.asignaValorcampoform(this.tablaForm,"cod_fpago",this.regCliente.cod_fpago);
                    this.libmantab.asignaValorcampoform(this.tablaForm,"cod_lista",this.regCliente.lista_prec); 
                    this.libmantab.asignaValorcampoform(this.tablaForm,"id_contacto",this.regCuenta.id_contapri);
                                       
                    // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "descuento", this.regCliente.descuento)
                    // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "lista_prec", this.regCliente.lista_prec)
                    // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "ag_retened", this.regCliente.ag_retened)
                  }
                  this.cargocliente = true;
                  // this.tabstrip.selectTab(0);
                }
              });
            this.tabstrip.selectTab(0);
            // console.log('cargo cuenta form quedo:');
            // console.log(this.tablaForm);
            this.cargocuenta = true;
          } else {
            // console.log("llega con error no encontro limpiar");
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",0);
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_tercer","");
            if (typeof(this.txtcod_tercer) !='undefined'){
              // this.txtcod_tercer.inputbus.nativeElement.value = '';
              this.renderer.setValue(this.txtcod_tercer,''); 
            }
            this.labelcuenta='';

          }
        });
    } else {
      this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",0);
      this.libmantab.asignaValorcampoform(this.tablaForm,"cod_tercer","");
      if (typeof(this.txtcod_tercer) !='undefined'){
        // this.txtcod_tercer.inputbus.nativeElement.value = '';
        this.renderer.setValue(this.txtcod_tercer,''); 
      }
      this.labelcuenta='';
    }
  }


  verComboprocven(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    var lvalant: string;
    var lcambiadatosval = false;
    var lidcliepote: any;
    var lidcuenta: any;
    this.cargoprocven = false;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalant = lcontrolcampo.value;
    // console.log("verComboprocven 1");
    // console.log(event);
    if (typeof event != "object") {
      if (event) {
        // console.log("valor que llega ciudades 2 asigna event");
        // lcontrolcampo.setValue(event);
        lvalor = event;
        // console.log("valor que llega ciudades 2 asigna event 2");
        // return
      }
    } else if (event.length > 0) {
      var result0 = event[0];
      lncampo = "result0." + pcamporetorna;
      lvalor = eval(lncampo);
      if (lvalor) {
      } else {
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    } else {
      lvalor = "";
    }

    lcontrolcampo.setValue(lvalor);

    if (lvalor != lvalant) {
      lcambiadatosval = true;
    }
    // console.log("verComboprocven 3");

    // console.log("verprocven lavlor:"+lvalor);
    if (lvalor) {
      // console.log("verComboprocven 4");
      // console.log("verprocven a traer registro lavlor:"+lvalor);
      this.mantbasicaService
        .getregTabla(lvalor, "PROC_VEN", "10", "cod_procve", "", "", "nombres")
        .subscribe(regTabla => {
          // console.log("verComboprocven 5");
          // console.log("verprocven 1");
          if (typeof regTabla != "undefined") {
            // console.log("verprocven 2");
            this.regProcven = regTabla;
            this.cargoprocven = true;
            // this.id_contacto = regTabla.id_contacto;
            if (lcambiadatosval) {
              // console.log("verprocven 6");
              //Asignar campos de acuerdo con procedimiento
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "cod_mone",
                this.regProcven.cod_mone
              );
              this.libmantab.asignaValorcampoform(
                this.tablaForm,
                "cod_dcotiz",
                this.regProcven.doc_cotiz
              );
              this.cod_dcotiz = this.regProcven.doc_cotiz;
              if (this.estadograbacotiz === "B0" || this.estadograbacotiz === "B1") {
                this.disablecod_procve = false;
              } else this.disablecod_procve = true;
              this.disableid_cuentacrm = false;

              if (this.regProcven.en_omoneda) {
                // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "nombre", this.regProcven.cod_mone)
              }
              //verificar que este seleccionado un cliente potencial o una cuenta
              lidcliepote = this.libmantab.valCampoform(this.tablaForm,"id_cliepote");
              lidcuenta = this.libmantab.valCampoform(this.tablaForm,"id_cuentacrm");
              // console.log("verprocven 7");
              if (this.cargocliepoten || this.cargocuenta) {
                // console.log("verprocven 8");
                //asegurarse de asignar campos de acuerdo con la cuenta o cliente potencial
                if (this.cargocuenta) {
                  // console.log("verprocven 5 lleado y desactivando");
                  // console.log("verprocven 6");
                  this.disableid_cliepote = true;
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_ciudad",this.regCuenta.cod_ciudad);
                  // this.libmantab.asignaValorcampoform(this.tablaForm, "cod_tercer", this.regCuenta.cod_tercer);
                  this.disablecod_ciudad = this.regProcven.per_cciudad
                    ? false
                    : true;
                  // this.libmantab.disableCampoform(this.tablaForm, "cod_ciudad");
                  // console.log("verprocven 7");
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_zona",this.regCliente.cod_zona);
                  this.disablecod_zona = this.regProcven.per_czona
                    ? false
                    : true;
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_vended",this.regCliente.cod_vended);
                  // this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_vended",NetsolinApp.oapp.cuserid);
                  this.disablecod_vended = (this.regProcven.per_cvende || this.regCliente.cod_vended != NetsolinApp.oapp.cuserid) ? false : true;
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_lista",this.regCliente.lista_prec);
                  this.disablecod_lista = this.regProcven.per_clista
                    ? false
                    : true;
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_fpago",this.regCliente.cod_fpago);
                  // console.log("verprocven 8");
                  this.disablecod_fpago = this.regProcven.per_cfpago
                    ? false
                    : true;
                  // this.libmantab.asignaValorcampoformsindato(this.tablaForm,"descuento",this.regCliente.descuento);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"id_contacto",this.regCuenta.id_contapri);
                  // console.log("verprocven 9");
                } else if (this.cargocliepoten) {
                  this.disableid_cuentacrm = true;
                  // console.log("verprocven 10");
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_vended",NetsolinApp.oapp.cuserid);
                  this.disablecod_vended = (this.regProcven.per_cvende || this.regCliente.cod_vended != NetsolinApp.oapp.cuserid) ? false : true;
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_ciudad",this.regCliepoten.cod_ciudad);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"id_contacto",this.regCliepoten.id_contprin);
                  this.libmantab.asignaValorcampoform(this.tablaForm,"cod_tercer","");
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"descuento",0);
                  // console.log("verprocven 11");
                }
              } else {
                //error debe seleccionar un cliente potencial o una cuenta
                // console.log("verprocven 12");
                this.enerror = true;
                this.cargoprocven = false;
                this.message =
                  "Error. Debe seleccionar un cliente potencial o una cuenta para continuar.";
              }
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "nombre", this.regTercero.nombre)
              // console.log("verprocven 12");
            }
            // console.log("verprocven 13");
          }
          // console.log("verprocven 14");
        });
    }
  }
  verCombolistaprec(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    if (typeof event != "object") {
      if (event) {
        // console.log("valor que llega ciudades 2 asigna event");
        // lcontrolcampo.setValue(event);
        lvalor = event;
        // console.log("valor que llega ciudades 2 asigna event 2");
        // return
      }
    } else if (event.length > 0) {
      var result0 = event[0];
      lncampo = "result0." + pcamporetorna;
      lvalor = eval(lncampo);
      if (lvalor) {
      } else {
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    } else {
      this.cargoprocven = false;
      lvalor = "";
    }
    lcontrolcampo.setValue(lvalor);
  }

  verCombocontacto(event, pcamporecibe, pcamporetorna) {
    //OJO FEB 23 2018 QUDA PENDIENTE SE QUITO LLAMADO POR QUE NO MUESTRA BIEN EL CONTACTO EN EL COMBO
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    var lvalant: string;
    var lcambiadatosval = false;

    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lcambiadatosval = lcontrolcampo.value;
    if (typeof event != "object") {
      if (event) {
        // console.log("valor que llega ciudades 2 asigna event");
        // lcontrolcampo.setValue(event);
        lvalor = event;
        // console.log("valor que llega ciudades 2 asigna event 2");
        // return
      }
    } else if (event.length > 0) {
      var result0 = event[0];
      lncampo = "result0." + pcamporetorna;
      lvalor = eval(lncampo);
      if (lvalor) {
      } else {
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    } else {
      lvalor = "";
    }

    lcontrolcampo.setValue(lvalor);
    if (lvalor != lvalant) {
      // console.log("verCombocod_tercer Cambiar datos");
      lcambiadatosval = true;
    }
    //traer el contacto
    this.cargocontacto = false;
    if (lvalor) {
      this.mantbasicaService
        .getregTabla(
          lvalor,
          "CONTACTOS",
          "21",
          "id_contacto",
          "",
          "",
          "nombres"
        )
        .subscribe(regTabla => {
          console.log('get contacto',regTabla);
          if (typeof regTabla != "undefined") {
            this.regContacto = regTabla;
            // this.id_contacto = regTabla.id_contacto;
            if (lcambiadatosval) {
              // this.libmantab.asignaValorcampoformsindato(this.tablaForm, "nombre", this.regTercero.nombre)
            }
            this.cargocontacto = true;
          }
        });
    }
  }
  verCombocod_fpago(event, pcamporecibe, pcamporetorna) {
    // console.log("valor que llega verCombocod_fpago");
    // console.log(event);
    // console.log(pcamporecibe);
    // console.log(pcamporetorna);
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    // console.log("valor que llega verCombocod_fpago 1");
    if (typeof event != "object") {
      if (event) {
        // console.log("valor que llega ciudades 2 asigna event");
        // lcontrolcampo.setValue(event);
        lvalor = event;
        // console.log("valor que llega ciudades 2 asigna event 2");
        // return
      }
    } else if (event.length > 0) {
      var result0 = event[0];
      lncampo = "result0." + pcamporetorna;
      lvalor = eval(lncampo);
      if (lvalor) {
      } else {
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    } else {
      lvalor = "";
    }

    lcontrolcampo.setValue(lvalor);
  }

  verCombocod_ciudad(event, pcamporecibe, pcamporetorna) {
    // console.log("valor que llega ciudades");
    // console.log(event);
    // console.log(pcamporecibe);
    // console.log(pcamporetorna);
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    if (typeof event != "object") {
      if (event) {
        // console.log("valor que llega ciudades 2 asigna event");
        // lcontrolcampo.setValue(event);
        lvalor = event;
        // console.log("valor que llega ciudades 2 asigna event 2");
        // return
      }
    } else if (event.length > 0) {
      var result0 = event[0];
      lncampo = "result0." + pcamporetorna;
      lvalor = eval(lncampo);
      if (lvalor) {
      } else {
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    } else {
      lvalor = "";
    }

    lcontrolcampo.setValue(lvalor);
  }

  verListestado(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verEstadocot(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  openconsulta(ptipo) {
    if (ptipo == "tercero") {
      this.consultatercero = true;
    } else if (ptipo == "cliepoten") {
      this.consultacliepoten = true;
    } else if (ptipo == "cuenta") {
      this.consultacuenta = true;
    }
  }
  public closeconsulta(ptipo) {
    if (ptipo == "tercero") {
      this.consultatercero = false;
    } else if (ptipo == "cliepoten") {
      this.consultacliepoten = false;
    } else if (ptipo == "cuenta") {
      this.consultacuenta = false;
    }
    this.titulobreadcrumbs();
  }

  openeditar(ptipo) {
    if (ptipo == "tercero") {
      this.editatercero = true;
    } else if (ptipo == "cliepoten") {
      this.editacliepoten = true;
    } else if (ptipo == "cuenta") {
      this.editacuenta = true;
    }
  }
  public closeeditar(ptipo) {
    if (ptipo == "tercero") {
      this.editatercero = false;
    } else if (ptipo == "cliepoten") {
      this.editacliepoten = false;
    } else if (ptipo == "cuenta") {
      this.editacuenta = false;
    }
    this.titulobreadcrumbs();
  }

  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == "cotiza") {
      this.crearcotiza = true;
    } else if (ptipo == "contacto") {
      this.crearcontacto = true;
    } else if (ptipo == "origencp") {
      this.crearorigencp = true;
    } else if (ptipo == "causalper") {
      this.crearcausalperd = true;
    }
  }

  
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    if (ptipo == "cotiza") {
      this.crearcotiza = false;
    } else if (ptipo == "contacto") {
      this.crearcontacto = false;
    } else if (ptipo == "origencp") {
      this.crearorigencp = false;
    } else if (ptipo == "causalper") {
      this.crearcausalperd = false;
    }
    this.titulobreadcrumbs();
  }

  // carga diccionarios para cuando se llama mantenimiento desde otro que no venga por listado
  cargadiccionarios(objeto) {
    this.cargando = true;
    // console.log("inicializa carga diccionarios llamado cotiza objeto:" + objeto);
    var lcamposdic;
    var lsegobj;
    this.service.getNetsolinObjmantbasica(objeto).subscribe(
      result => {
        // console.log("inicializacpaturatabla cargadic 1");
        var result0 = result[0];
        if (typeof result.isCallbackError != "undefined") {
          // console.log("inicializacpaturatabla cargadic 2");
          this.enlistaerror = true;
          this.listaerrores = result.messages;
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
        // console.log('cargadiccionarios cotiza NetsolinApp');
        // console.log(NetsolinApp);

        let var1 = JSON.stringify(NetsolinApp.objpartablabas);
        // console.log("inicializacpaturatabla cargadic 2");
        localStorage.setItem("VPAR" + NetsolinApp.objpartablabas.tabla, var1);
        // console.log("inicializacpaturatabla cargadic 3");
        // console.log("VPAR: " + 'VPAR' + NetsolinApp.objpartablabas.tabla);
        // console.log("inicializacpaturatabla 2");
        this.title = NetsolinApp.objpartablabas.titulo;
        this.rutamant =  NetsolinApp.objpartablabas.rutamant;
        this.paplica = NetsolinApp.objpartablabas.aplica.toString();
        this.ptablab =  NetsolinApp.objpartablabas.tabla;
        this.pcampollave = NetsolinApp.objpartablabas.campollave;
        this.pcamponombre = NetsolinApp.objpartablabas.camponombre;
        this.pclase_nbs = NetsolinApp.objpartablabas.clase_nbs;
        this.pclase_val = NetsolinApp.objpartablabas.clase_val;
    
        this.lobjpartablas=NetsolinApp.objpartablabas;
        // console.log(NetsolinApp.objpartablabas);
        // console.log('this.lobjpartablas');
        // console.log(this.lobjpartablas);
        this.service
          .getNetsolinDictabla(
            NetsolinApp.objpartablabas.tabla,
            parseInt(result0.aplica),
            objeto
          )
          .subscribe(
            result => {
              var result0 = result[0];
              // console.log("inicializacpaturatabla 3");
              // console.log(result0);
              if (typeof result.isCallbackError != "undefined") {
                this.enlistaerror = true;
                // console.log("error en carga dic cotiza");
                // console.log(result);
                this.listaerrores = result.messages;
                this.cargando = false;
                return;
              }
              // console.log("result nicializacpaturatabla 3.1");
              // console.log(result);
              // console.log(result0);
              lcamposdic = result;
              let var2 = JSON.stringify(result);
              localStorage.setItem(
                "DDT" + NetsolinApp.objpartablabas.tabla,
                var2
              );
              // console.log("ddt: " + 'DDT' + NetsolinApp.objpartablabas.tabla);
              // console.log("inicializacpaturatabla 4");
              this.service.getNetsolinSegObj(objeto).subscribe(
                result => {
                  lsegobj = result;
                  let vars = JSON.stringify(result);
                  localStorage.setItem("SOBJ" + objeto, vars);
                  // console.log("SOBJ: " + 'SOBJ' + objeto);
                  if (!result.per_adicionar) {
                    this.enerror = true;
                    this.message =
                      "Error. No tiene permisos para adcionar. Consulte con su administrador";
                    this.cargando = false;
                    return;
                  }
                  // console.log("inicializacpaturatabla 5");
                  // console.log(NetsolinApp.objpartablabas);
                  // console.log('this.lobjpartablas');
                  // console.log(this.lobjpartablas);
                 this.inicializacomponente(this.lobjpartablas,lcamposdic,lsegobj);
                },
                error => {
                  this.enerror = true;
                  this.message = "Error no se pudo cargar";
                  localStorage.setItem("SOBJ" + objeto, null);
                  this.cargando = false;
                }
              );
            },
            error => {
              localStorage.setItem("DDT" + result0.tabla, null);
              this.enerror = true;
              this.message = "Error no se pudo cargar";
              this.cargando = false;
            }
          );
      },
      error => {
        // console.log('Error configurando objeto:' + this.objeto)
        // console.log(error);
        this.enerror = true;
        this.message = "Error no se pudo cargar";
        this.cargando = false;
      }
    );
    // this.cargando= false;
  }
  //retorna filtro adecuado de acuerdo con motor para la tabla dada
  retornafiltro(ptabla) {
    // console.log('retornafiltro: 1');
    if (ptabla == "C_LIS_PREC") {
      // console.log('retornafiltro: 2');
      // console.log(NetsolinApp);
      // console.log(NetsolinApp.oapp);
      //en lista de precios debe estar activa y ser de ventas
      // console.log(typeof(NetsolinApp.oapp.motor));
      // console.log(NetsolinApp.oapp.motor)
      if (NetsolinApp.oapp.motor == 3) {
        // console.log('retornafiltro:  ventas=1 and inactivo=0');
        return "ventas=1 and inactivo=0";
      } else {
        return "ventas=true and inactivo=false";
      }
      // console.log('retornafiltro: 3');
    } else if (ptabla == "PROC_VEN") {
      // console.log('retornafiltro: 4');
      if (NetsolinApp.oapp.motor == 3) {
        // console.log('retornafiltro:  ventas=1 and inactivo=0');
        return "util_cotiz=1 and inactivo=0";
      } else {
        return "util_cotiz=true and inactivo=false";
      }
    } else if (ptabla == "CONTACTOS") {
      // console.log('retornafiltro: 4');
      if (this.captura_xcuenta) {
        // console.log("retornafiltro contactos: por id cuenta");
        return "id_cuenta=" + this.id_cuentacrm;
      } else if (this.captura_xcliepoten) {
        // console.log("retornafiltro contactos: por id clie poten");
        return "id_cliepote=" + this.id_cliepoten;
      }
    } else {
      return "*";
    }
  }

  //cambia variable para que abra ventana de busqueda de referencia
  openbusqueda(ptipo) {
    if (ptipo == "cuenta") {
      // var lcontrolcampo: any;
      //leer lo digitato en referencia para que sea valor ini a buscar
      // lcontrolcampo = this.tablaForm.controls["cod_refven"];
      // this.referebuscar = lcontrolcampo.value;
      this.llamabuscacuenta = true;
    }
  }
  public closebusqueda(valllega, ptipo) {
    if (ptipo == "cuenta") {
      //asignar el valor retornado a campo id_cuentacrm
      // console.log("close busqueda cuenta llega 9 valllega:" + valllega);
      // console.log("closebussqueda vallega cuenta typeof (valllega):" + typeof valllega);
      // console.log('closebussqueda vallega cuenta valllega:'+valllega);
      if (typeof valllega != "undefined" && valllega != 0) {
        // console.log("close busqueda cuenta llega 1 valllega:" + valllega);
        // this.validacuenta(valllega, "id_cuentacrm", "id_cuentacrm");
        this.libmantab.asignaValorcampoform(this.tablaForm,"cod_tercer",valllega);
        // this.verCombocuenta($event,'id_cuentacrm','id_cuentacrm')"
      }
      this.llamabuscacuenta = false;
    }
    this.titulobreadcrumbs();
  }
  // verCombocuenta(event, pcamporecibe, pcamporetorna) {
  //   var lcontrolcampo: any;
  //   var lvalor: any;
  //   var lncampo: string;
  //   var lvalorn: any;
  //   var lncampon: string;
  //   var lcod_refant: string;
  //   var lcambiadatosref = false;
  //   this.cargoprod = false;
  //   this.message = "";
  //   this.enerror = false;
  //   console.log("verCombocod_refven 1");
  //   console.log(event);
  //   //asegurarse que cod_prod quede vacio y sin ser obligatorio
  //   this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
  //   this.libmantab.defineValidaCampo(this.tablaForm, "cod_prod", []);
    
  //   // console.log(event.cbuscar);
  //   lcontrolcampo = this.tablaForm.controls[pcamporecibe];
  //   //guardar ref antes cambio para saber si cambio y cambia datos relacionados
  //   lcod_refant = lcontrolcampo.value;
  //   // console.log("verCombocod_refven 2");
  //   if (event.cbuscar.length > 0) {
  //     // console.log("verCombocod_refven 2.1");
  //     lvalor = event.cbuscar;
  //     // console.log("verCombocod_refven 2.2");
  //     if (lvalor) {
  //       // console.log("verCombocod_refven 2.2.1.1");
  //       // lncampon = "result0.nombre";
  //     } else {
  //       // console.log("verCombocod_refven 2.2.2.1");
  //       // console.log(result0);
  //       lncampo = "result0.id";
  //       lvalor = eval(lncampo);
  //     }
  //   }
  //   lcontrolcampo.setValue(lvalor);
  //   if (lvalor != lcod_refant) {
  //     // console.log("verCombocod_tercer Cambiar datos");
  //     lcambiadatosref = true;
  //   }
  //   //traer referencia
  //   this.cargorefere = false;
  //   this.labelcod_refven = "";
  //   // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
  //   if (lvalor) {
  //     this.mantbasicaService
  //       .getregTabla(lvalor, "REFERE_V", "10", "cod_refven", "", "", "nombre")
  //       .subscribe(regTabla => {
  //         if (typeof regTabla.isCallbackError == "undefined") {
  //           this.regReferen = regTabla;
  //           this.id_refconsulta = regTabla.cod_refven;
  //           this.labelcod_refven = regTabla.nombre;
  //           this.cargorefere = true;
  //           // console.log("verCombocod_tercer ant regTercero:");
  //           // console.log(this.regTercero);
  //           //cambiar solo si esta vacio o no definido usar asignaValorcampoformsindato de lo contrario asignaValorcampoform
  //           // this.libmantab.asignaValorcampoform(this.tablaForm, "nombre", this.regTercero.nombre)
  //           // if (lcambiadatosref) {
  //             this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_umed",this.regReferen.cod_umed);
  //             this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_umed_c",this.regReferen.cod_umed);
  //             console.log('descrip a vacio en vercombo ref ventas ');
  //             this.libmantab.asignaValorcampoformsindato(this.tablaForm,"descrip",this.regReferen.nombre);
  //             //cargar lista de precios
  //             this.regCotizac.cod_lista;
  //             //llenar parametros para consultar lista de precios
  //             NetsolinApp.param_precioven.cod_tercer = this.regCotizac.cod_tercer;
  //             NetsolinApp.param_precioven.proc_ven = this.regCotizac.cod_procve;
  //             NetsolinApp.param_precioven.lista = this.regCotizac.cod_lista;
  //             NetsolinApp.param_precioven.cod_refven = this.regReferen.cod_refven;

  //             this.service.getNetsolinObjconParametros(this.vglobal.obj_precio,NetsolinApp.param_precioven)
  //               .subscribe(result => {
  //                   //viene registro con el precio o error
  //                   // console.log("eje getNetsolinObjconParametros retorna result");
  //                   // console.log(result);
  //                   var result0 = result[0];
  //                   // console.log(result0);
  //                   if (typeof result.isCallbackError === "undefined") {       
  //                     //viene el registro con el precio en result0
  //                     var lprecio = this.libmantab.valCampoform(this.tablaForm,"valor_list");
  //                     this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",result0.valor);
  //                     this.libmantab.asignaValorcampoform(this.tablaForm,"por_desc",result0.descuento);
  //                     if (result0.valor > 0) {
  //                       if (result0.fijo)
  //                           this.libmantab.disableCampoform(this.tablaForm,"valor_list");                       
  //                       else 
  //                         this.libmantab.enableCampoform(this.tablaForm,"valor_list");                       
  //                     } else
  //                       this.libmantab.enableCampoform(this.tablaForm,"valor_list");                       
                      
  //                     if (result0.des_fijo) {
  //                       this.libmantab.disableCampoform(this.tablaForm,"por_desc");                       
  //                     } else {
  //                       this.libmantab.enableCampoform(this.tablaForm,"por_desc");                                               
  //                     }
  //                     if (this.regCotizac.inc_iva)
  //                       this.por_iva = result0.por_iva;
  //                     else 
  //                       this.por_iva = 0;
                      

  //                   } else {
  //                     //viene el registro con el error
  //                     this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
  //                     var regerror = result.messages[0];
  //                     this.message = regerror.menerror;
  //                     this.showError(regerror.menerror);
  //                   }
  //                 },
  //                 error => {
  //                   this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
  //                   console.log("Error en getNetsolinObjconParametros");
  //                   console.log(error);
  //                   this.showError(error);
  //                 }
  //               );

  //             // this.inicializado = true;
  //             this.tabstrip.selectTab(0);
  //             this.cargorefere = true;
  //           // }
  //         } else {
  //           console.log("llega con error no encontro limpiar");
  //           // console.log('add producto dejando en blanco nativeElement');
  //           // console.log(this.txtCodrefven);
  //           // console.log(this.txtCodrefven.inputbus.nativeElement);
  //           this.libmantab.asignaValorcampoform(
  //             this.tablaForm,
  //             "cod_refven",
  //             ""
  //           );
  //           //asegurarse de que quede vacio
  //           this.txtCodrefven.inputbus.nativeElement.value = "";
  //         }
  //       });
  //   } else {
  //     //ad producto
  //     console.log("add producto dejando en blanco nativeElement");
  //     // console.log(this.txtCodrefven);
  //     // console.log(this.txtCodrefven.inputbus.nativeElement);
  //     this.libmantab.asignaValorcampoform(this.tablaForm, "cod_refven", "");
  //     //asegurarse de que quede vacio
  //     this.txtCodrefven.inputbus.nativeElement.value = "";
  //   }
  // }

  //asigna el titulo que va en partes superior breadcrums
  public titulobreadcrumbs() {
    if (this.estadograbacotiz === "B0") {
      this.vglobal.titulopag =
        "Cotización: (Nuevo) Borrador" +
        " " +
        this.cod_dcotiz +
        "/" +
        this.num_dcotiz;
    } else if (this.estadograbacotiz === "B1") {
      this.vglobal.titulopag =
        "Cotización: Borrador" + " " + this.cod_dcotiz + "/" + this.num_dcotiz;
    }
  }
  // console.log('retornafiltro: 5');
  closeactivar(){
    this.dialogoactivar=false;
  }
  closeaimprimir(){
    this.dialogoimprimir=false;
  }
  closerevisar(){
    this.dialogorevisar=false;
  }

  closeconvsolped(){
    this.dialogoconvsolped=false;
  }

  closecerrar(){
    this.dialogocerrar=false;
  }
  closemodalerror(){
    this.menerrormodal='';
    this.enerrormodal = false;
  }
  handleEstadoChange(value) {
    if (value.value=='P'){
      this.ngcierrexperdida = true;
    } else {
      this.ngcierrexperdida = false;
    }
  }  
}
