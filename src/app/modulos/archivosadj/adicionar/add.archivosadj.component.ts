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
// import { FileInfo, FileRestrictions } from '@progress/kendo-angular-upload';
import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, FileInfo } from '@progress/kendo-angular-upload';
//OP ABRIL 28 2018 IMPORTANTE
//ESTE C OMPONENTE NO SE UTILIZA YA QUE EL LLAMADO A SUBIR EL 
//ARCHIVO SE HACE POR OBJETO ESTANDAR NETSOLIN

@Component({
  selector: "add-archivosadj",
  templateUrl: './add.archivosadj.component.html',
  styleUrls: ['./add.archivosadj.component.css']
})
export class AddregarchivosadjComponent implements OnInit {
  @Input() vparcaptura: string;
  //Modulo asociado a la archivosadj 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
  @Input() modulo_asoc: string;
  //id del modulo al que se asocia la archivosadj
  @Input() id_modasoc: number;
  // uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  //op abril 6 18 pendiente saver como guardar el archivo por ahora se puede ver la imagen si es img
  //se desactiva
  uploadSaveUrl = 'saveUrl';    // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl';
  public myRestrictions: FileRestrictions = {
    allowedExtensions: ['jpg', 'jpeg', 'png']
  };
  public imagePreviews: FileInfo[] = [];
  public events: string[] = [];
  
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
  subtitle = "(Adicionar archivosadj)";
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
  creartipoarch = false;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 

  constructor(
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private copiavglobal: varGlobales,
    public libmantab: MantablasLibreria,
    private activatedRouter: ActivatedRoute,
    private pf: FormBuilder,
    private service: NetsolinService
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
    // lcontrol = this.tablaForm.get("id_tiparch");
    // console.log("ngoninit cuentas 1.3 inicializaform 2");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    // lcontrol._updateOn = "blur";
    avalida.push(Validators.required);
    // this.libmantab.defineValidaCampo(this.tablaForm, "id_tiparch", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "descripcion", avalida);
      
    //por defecto registrar seguimiento en tipo archivosadj
    this.libmantab.asignaValorcampoform(this.tablaForm, "id_tiparch", "1");
    this.libmantab.asignaValorcampoform(this.tablaForm, "descripcion", "");
    var hoy = new Date();
    this.libmantab.asignaValorcampoform(this.tablaForm, "fecha_crea", hoy.toISOString().substring(0,10));
    this.cargomodasoc=false;
    // console.log("ngoninit cuentas 1.3 inicializaform 2");
    //dependiendo del modulo asociado traer el registro 
      //Modulo asociado a la archivosadj 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
      // console.log("ngoninit cuentas 1.3 inicializaform 21 typeof:"+typeof(this.id_modasoc));
      switch(this.modulo_asoc) { 
      case "1": { 
        //  this.carga_contacto()
         break; 
      } 
      case "2": { 
        // this.carga_cliepoten()
         break; 
      } 
      case "3": { 
        // this.carga_cuenta()
         break; 
      } 
      case "4": { 
        //carga cotización
        console.log("ngoninit cuentas 1.3 inicializaform 3");
        this.mantbasicaService.getregTabla(this.id_modasoc,"COTIZACRM_C","21","id_cotiza","","","num_dcotiz")
        .subscribe(regTabla => {
          console.log("ngoninit cuentas 1.3 inicializaform 31");
          if (typeof regTabla != "undefined") {
            console.log("ngoninit cuentas 1.3 inicializaform 31 1");
            this.regModasoc = regTabla;
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cliepote",regTabla.id_cliepote);
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_cuentacrm",regTabla.id_cliepote);
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_doca",regTabla.cod_dcotiz);
            this.libmantab.asignaValorcampoform(this.tablaForm,"num_doca",regTabla.num_dcotiz);
            this.labelmodasoc = 'Adicionando archivo para cotización: '+regTabla.cod_dcotiz+'/'+regTabla.num_dcotiz;
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
    this.tablaForm.get("id_tiparch").valueChanges.subscribe(val => {
      //si cambia el tipo de archivosadj
      // console.log("onchange prod_catal");
      // console.log(val);
      if (this.grabando)
          return;
      this.message = "";
      this.enerror = false;
      //asignar valor del check a prod catalogo 
      var avalida = [];
      avalida.push(Validators.required);
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
    this.libmantab.asignaValorcampoform(this.tablaForm,"id_arch",numdocint);
    this.regTabla = this.saveregTabla();
    // console.log('tabla:'+this.ptablab);
    // console.log('paplica:'+this.paplica);
    // console.log('pcampollave:'+this.pcampollave);
    // console.log('pclase_nbs:'+this.pclase_nbs);
    // console.log('pclase_val:'+this.pclase_val);
    // console.log('pcamponombre:'+this.pcamponombre);
    // console.log(this.regTabla);
    this.mantbasicaService
      .postregTabla(this.regTabla,this.ptablab,this.paplica,this.pcampollave,this.pclase_nbs,this.pclase_val,this.pcamponombre)
        .subscribe(newpro => {
          console.log('retorno obj graba');
          this.grabando = false;
          var result0 = newpro[0];
          if (typeof newpro.isCallbackError != "undefined") {
            this.grabo = false;
            this.enlistaerror = true;
            this.listaerrores = newpro.messages;
            console.log('Con error en graba');
            console.log(newpro);
          } else {
            console.log('sin error en graba');
            this.grabo = true;
            this.tablaForm.reset();            
            this.inicializaForm();
            this.showMensaje("Se adiciono archivo.");
          }
        },
        error => {
          console.log('Con error en objeto graba');
          console.log(error);
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
    this.libmantab.copiaVarcrumbs(this.vglobal);
    if (ptipo == "tipoarch") {
      this.creartipoarch = true;
    }
  }
  public closeadicion(ptipo) {
    this.libmantab.restauraVarcrumbs(this.vglobal);
    if (ptipo == "tipoarch") {
      this.creartipoarch = false;
    } 
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
  verComboTipoarch(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    // console.log("verComboTipoarch");
    // console.log("event llego verComboTipoarch");
    // console.log(event);
    // console.log("pcamporecibe:"+pcamporecibe);
    // console.log("pcamporetorna:"+pcamporetorna);

    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    //si es indefinido dejar vacio
    if (typeof event == "undefined") {
      lcontrolcampo.setValue("");
      lvalor = "";
      return;
    }
    //si es por combog que retorna el valor o es por el que retorna objeto
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
    lcontrolcampo.setValue(lvalor.toString());
    // console.log("lcontrolcampo.setValue luego de setvalue");
    // console.log(lcontrolcampo);
  }

  public clearEventHandler(e: ClearEvent): void {
    this.log('Clearing the file upload');
    this.imagePreviews = [];
  }

  public completeEventHandler() {
    this.log(`All files processed`);
  }

  public removeEventHandler(e: RemoveEvent): void {
    this.log(`Removing ${e.files[0].name}`);

    const index = this.imagePreviews.findIndex(item => item.uid === e.files[0].uid);

    if (index >= 0) {
      this.imagePreviews.splice(index, 1);
    }
  }

  public selectEventHandler(e: SelectEvent): void {
    const that = this;

    e.files.forEach((file) => {
      that.log(`File selected: ${file.name}`);

      if (!file.validationErrors) {
        const reader = new FileReader();

        reader.onload = function (ev) {
          const image = {
            // src: ev.target.result,
            uid: file.uid
          };

          // that.imagePreviews.unshift(image);
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  private log(event: string): void {
    this.events.unshift(`${event}`);
    console.log('event');
    console.log(event);
  }

}
