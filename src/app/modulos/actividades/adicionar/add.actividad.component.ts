import {Component,VERSION,OnInit,Input,ViewChild,ElementRef} from "@angular/core";
import {FormControl,FormGroup,FormArray,FormBuilder,Validators,ValidatorFn} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import { ComboBoxComponent } from "@progress/kendo-angular-dropdowns";
import { NetsolinApp } from "../../../shared/global";
import { Netsbuscombogcampo } from "../../../netsolinlibrerias/netsbuscombog/netsbuscombogcampo.componente";
import { MantbasicaService } from "../../../services/mantbasica.service";
import { MantablasLibreria } from "../../../services/mantbasica.libreria";
import { UpperCaseTextDirective } from "../../../netsolinlibrerias/directive/upper-case.directive";
import { NetsolinService } from "../../../services/netsolin.service";
import { varGlobales } from "../../../shared/varGlobales";

@Component({
  selector: "add-actividad",
  templateUrl: './add.actividad.component.html',
  styleUrls: ['./add.actividad.component.css']
})
export class AddregactividadComponent implements OnInit {
  @Input() vparcaptura: string;
  //Modulo asociado a la actividad 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
  @Input() modulo_asoc: string;
  //id del modulo al que se asocia la actividad
  @Input() id_modasoc: number;
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  enerror = false;
  grabo = false;
  enlistaerror = false;
  inicializado = false;
  listaerrores: any[] = [];
  message = "";
  title: string;
  subtitle = "(Adicionar Actividad)";
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  nom_empre: string;
  cargomodasoc = false;
  regModasoc: any;
  labelmodasoc: string="";
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 

  constructor(
    private mantbasicaService: MantbasicaService,
    private service: NetsolinService,
    public libmantab: MantablasLibreria,
    private activatedRouter: ActivatedRoute,
    public vglobal: varGlobales,
    private pf: FormBuilder
  ) {}
  ngOnInit() {
    // .log("ngoninit cuentas 1");
    this.activatedRouter.params.subscribe(parametros => {
      // console.log("ngoninit cuentas 1.1");
      // this.varParam = parametros['varParam'];
      if (this.vparcaptura) {
        this.varParam = this.vparcaptura;
      } else {
        this.varParam = parametros["varParam"];
        // this.id_ccotiza = parametros['pidcotiza'];
        // this.id_dcotiza = parametros['pid_dcotiza'];
      }
      let lvart: any;
      lvart = localStorage.getItem(this.varParam);
      let lobjpar = JSON.parse(lvart);
      this.title = lobjpar.titulo;
      this.rutamant = lobjpar.rutamant;
      this.paplica = lobjpar.aplica;
      this.ptablab = lobjpar.tabla;
      this.pcampollave = lobjpar.campollave;
      this.pcamponombre = lobjpar.camponombre;
      this.pclase_nbs = lobjpar.clase_nbs;
      this.pclase_val = lobjpar.clase_val;
      this.tablaFormOrig = this.pf.group({});
      let lvar = "";
      lvar = localStorage.getItem("DDT" + this.ptablab);
      // console.log("ngoninit cuentas 1.2");
      this.camposform = JSON.parse(lvar);

      for (var litemobj of this.camposform) {
        // console.log("ngoninit cuentas 1.2.1");
        //Crear campo formulario con valor por default
        let vardefa: any;
        if (litemobj.type == "text" && litemobj.val_defaul.length != 0) {
          var strvd = litemobj.val_defaul.toUpperCase();
          if (strvd.substring(0, 5) != "OAPP." && strvd.substring(0, 9) != "THISFORM.") {
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
        if (litemobj.name==='cod_refven' || litemobj.name==='cod_prod'){
            //si es producto por defecto referencia obligatoria  se hace en inicializaForm

        } else {
        var avalida = [];
        if (litemobj.mensaje_er.length == 0) {
          litemobj.mensaje_er = "Valor Invalido";
        }
        if (litemobj.obliga) {
          avalida.push(Validators.required);
          //   lcampformctrl.setValidators([Validators.required])
        }
        if (litemobj.type == "text" && litemobj.longitud > 0) {
          avalida.push(Validators.maxLength(litemobj.longitud));
        }
        if (avalida.length > 0) {
          lcampformctrl.setValidators(avalida);
        }
        //Se debe deshabilitar si no permite adicionar
        if (!litemobj.per_adicionar && litemobj.type != "solcombog") {
          // lcampformctrl.disable();
        }
      }
        this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
      }
      // console.log("ngoninit cuentas 1.3");
      this.tablaForm = this.tablaFormOrig;
      this.inicializaForm();
      //  console.log('Formulario despues de init:');
      //  console.log(this.tablaForm);
    });
  }

  //Inicializar el formulario con valores por defecto y validaciones adicionales a los que vienen del diccionario
  inicializaForm() {
    //Dejar clase iden en 1 nit y nombres y apeelidos en blanco y desabilitados   
    var lcontrol: any;
    var avalida = [];
    // console.log(this.tablaForm);
    lcontrol = this.tablaForm.get("tipo_act");
    // console.log("ngoninit cuentas 1.3 inicializaform 2");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    lcontrol._updateOn = "blur";
    avalida.push(Validators.required);
    this.libmantab.defineValidaCampo(this.tablaForm, "tipo_act", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "asunto", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "descripcion", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "prioridad", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "estado", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_doca", []);
    this.libmantab.defineValidaCampo(this.tablaForm, "num_doca", []);
      
    //por defecto registrar seguimiento en tipo actividad
    this.libmantab.asignaValorcampoform(this.tablaForm, "tipo_act", "R");
    this.libmantab.asignaValorcampoform(this.tablaForm, "asunto", "");
    this.libmantab.asignaValorcampoform(this.tablaForm, "descripcion", "");
    this.libmantab.asignaValorcampoform(this.tablaForm, "prioridad", "B");
    var hoy = new Date();
    this.libmantab.asignaValorcampoform(this.tablaForm, "fecha_ven", hoy.toISOString().substring(0,10));
    this.libmantab.asignaValorcampoform(this.tablaForm, "estado", "A");
    this.cargomodasoc=false;
    // console.log("ngoninit cuentas 1.3 inicializaform 2");
    //dependiendo del modulo asociado traer el registro 
      //Modulo asociado a la actividad 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
      // console.log("ngoninit cuentas 1.3 inicializaform 21 typeof:"+typeof(this.id_modasoc));
      switch(this.modulo_asoc) { 
      case "1": { 
        //  this.carga_contacto()
         break; 
      } 
      case "2": { 
        // this.carga_cliepoten()
        this.mantbasicaService.getregTabla(this.id_modasoc,"CLIENPOTEN","21","id_cliepote","","","nom_empre")
        .subscribe(regTabla => {
          // console.log("ngoninit cuentas 1.3 inicializaform 31");
          if (typeof regTabla != "undefined") {
            // console.log("ngoninit cuentas 1.3 inicializaform 31 1");
            this.regModasoc = regTabla;
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",regTabla.id_cliepote);
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",regTabla.id_cuenta);
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_doca","");
            this.libmantab.asignaValorcampoform(this.tablaForm,"num_doca","");
            this.labelmodasoc = 'Adicionando actividad para cliente potencial: '+regTabla.cod_cliepote+'/'+regTabla.nom_empre;
            this.cargomodasoc = true;            
            this.inicializado = true;
          }
        });
         break; 
      } 
      case "3": { 
        // this.carga_cuenta()
        // console.log('a cargar cuenta id_modasoc:'+this.id_modasoc);       
        this.mantbasicaService.getregTabla(this.id_modasoc,"CUENTACRM","21","id_cuentacrm","","","nombre")
        .subscribe(regTabla => {
          // console.log("ngoninit cargo cuenta 1");
          // console.log(regTabla);
          if (typeof regTabla != "undefined") {
            // console.log("ngoninit cuentas 1.3 inicializaform 31 1");
            this.regModasoc = regTabla;
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",regTabla.id_cliepote);
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",regTabla.id_cuentacrm);
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_doca","");
            this.libmantab.asignaValorcampoform(this.tablaForm,"num_doca","");
            this.labelmodasoc = 'Adicionando actividad para cuenta: '+regTabla.cod_tercer+'/'+regTabla.nombre;
            this.cargomodasoc = true;            
            this.inicializado = true;
          }
        });
         break; 
      } 
      case "4": { 
        //carga cotización
        // console.log("ngoninit cuentas 1.3 inicializaform 3");
        this.mantbasicaService.getregTabla(this.id_modasoc,"COTIZACRM_C","21","id_cotiza","","","num_dcotiz")
        .subscribe(regTabla => {
          // console.log("ngoninit cuentas 1.3 inicializaform 31");
          if (typeof regTabla != "undefined") {
            // console.log("ngoninit cuentas 1.3 inicializaform 31 1");
            this.regModasoc = regTabla;
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",regTabla.id_cliepote);
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",regTabla.id_cuentacrm);
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_doca",regTabla.cod_dcotiz);
            this.libmantab.asignaValorcampoform(this.tablaForm,"num_doca",regTabla.num_dcotiz);
            this.labelmodasoc = 'Adicionando actividad para cotización: '+regTabla.cod_dcotiz+'/'+regTabla.num_dcotiz;
            this.cargomodasoc = true;            
            this.inicializado = true;
          }
        });
         break; 
      } 
      case "5": { 
        // this.carga_pedido()
         break; 
      } 
      default: { 
         break; 
      } 
   }
  //  console.log("ngoninit cuentas 1.3 inicializaform 4");
 
    this.message = "";
    this.enerror = false;
  }


  //Si cambia el codigo llenar el campo estado a Nuevo
  onChanges(): void {
    this.tablaForm.get("tipo_act").valueChanges.subscribe(val => {
      //si cambia el tipo de actividad
      // console.log("onchange prod_catal");
      // console.log(val);
      if (this.grabando)
          return;
      this.message = "";
      this.enerror = false;
      //asignar valor del check a prod catalogo 
      var avalida = [];
      avalida.push(Validators.required);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"por_desc",0);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"cantidad_c",0);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"por_iva",0);      

      // if (this.prod_catalogo) {
      //   //si es producto de catalogo limpiar campos de prod fuera de catalogo 
      //   // hacer obligatorio campo referencia. Y no obligatorio el campo del producto fuera de catalogo
      //   this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
      //   console.log('descrip a vacio en onchange prod_catal ');
           
      // } else {
      //   //si es producto fuera de catalogo limpiar campos de referencia prod  de catalogo 
      //   this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", []);
      //   this.cargorefere = false;
      // }
    });

    this.tablaForm.get("estado").valueChanges.subscribe(val => {
      if (this.grabando)
          return;
      // this.calculosItem();
    });
  }

  onSubmit() {
    // console.log('onsubmit adcion producto');
    var lcontrol: any;
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    // this.calculosItem();
    this.grabando = true;
    //asignar otros valores antes de grabar
    this.libmantab.asignaValorcampoform(this.tablaForm, "mod_asociado", this.modulo_asoc);
    this.libmantab.asignaValorcampoform(this.tablaForm, "id_modasocia", this.id_modasoc);
    var numdocint = Math.floor(Math.random() * 999999);
    this.libmantab.asignaValorcampoform(this.tablaForm,"id_activ",numdocint);
    this.regTabla = this.saveregTabla();
    this.regTabla.usuario = NetsolinApp.oapp.cuserid;
    this.mantbasicaService
      .postregTabla(this.regTabla,this.ptablab,this.paplica,this.pcampollave,this.pclase_nbs,this.pclase_val,this.pcamponombre)
        .subscribe(newpro => {
          this.grabando = false;
          var result0 = newpro[0];
          if (typeof newpro.isCallbackError != "undefined") {
            this.grabo = false;
            this.enlistaerror = true;
            this.listaerrores = newpro.messages;
          } else {
            this.grabo = true;
            this.tablaForm.reset();            
            this.inicializaForm();
            this.showMensaje("Se adiciono registro.");
          }
        },
        error => {
          this.grabando = false;
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
  
  openconsulta(ptipo) {
  }
  public closeconsulta(ptipo) {
  }

  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
  }

  //maneja el control para cerrar


  //retorna filtro adecuado de acuerdo con motor para la tabla dada
  retornafiltro(ptabla) {
    // console.log('retornafiltro: 1');
    // if (ptabla == "PRODUCTOS") {
    //   if (NetsolinApp.oapp.motor == 3) {
    //     // console.log('retornafiltro:  inactivo=0');
    //     return "inactivo=0";
    //   } else {
    //     return "inactivo=false";
    //   }
    //   // console.log('retornafiltro: 3');
    // } else {
    //   return "*";
    // }
  }
  verListtipo_act(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }
  verListprioridad(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
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
}
