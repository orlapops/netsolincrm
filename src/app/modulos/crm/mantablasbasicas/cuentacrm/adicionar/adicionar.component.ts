import { Component, VERSION, OnInit, Input, ViewChild } from "@angular/core";
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

import { NetsolinApp } from "../../../../../shared/global";
import { UpperCaseTextDirective } from "../../../../../netsolinlibrerias/directive/upper-case.directive";
import { MantbasicaService } from "../../../../../services/mantbasica.service";
import { MantablasLibreria } from "../../../../../services/mantbasica.libreria";
import { varGlobales } from "../../../../../shared/varGlobales";

//prueba firebase
// import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: "crm-addcuenta",
  templateUrl: "./adicionar.component.html",
  styleUrls: ["./adicionar.component.css"]
})
export class AddregcuentaComponent implements OnInit {
  @Input() vparcaptura: string;
  @ViewChild("tabstrip") public tabstrip: TabStripComponent;
  @ViewChild("combociudad") public ccombociudad: ComboBoxComponent;
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
  subtitle = "(Adicionar Registro)";
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  crearcampana = false;
  crearsectore = false;
  crearorigencp = false;
  crearclaxvolven = false;
  consultatercero = false;
  consultacliepoten = false;
  nom_empre: string;
  cargotercero = false;
  regTercero: any;
  cargocliente = false;
  regCliente: any;
  cargocliepoten = false;
  regCliepoten: any;
  cargocontacto = false;
  regContacto: any;
  vvalocategoria: string;
  id_terconsulta: string;
  id_cliepoten: string;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 

  constructor(
    // private db: AngularFirestore,
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private copiavglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private activatedRouter: ActivatedRoute,
    private pf: FormBuilder
  ) {}
  ngOnInit() {
    // console.log("ngoninit cuentas 1");
    this.activatedRouter.params.subscribe(parametros => {
      // console.log("ngoninit cuentas 1.1");
      // this.varParam = parametros['varParam'];
      if (this.vparcaptura) {
        this.varParam = this.vparcaptura;
      } else {
        this.varParam = parametros["varParam"];
      }
      let lvart: any;
      lvart = localStorage.getItem(this.varParam);
      let lobjpar = JSON.parse(lvart);
      this.title = lobjpar.titulo;
      this.rutamant = lobjpar.rutamant;
      this.vglobal.titulopag = "Adicionar: " + this.title;
      this.vglobal.rutaanterior = "/" + this.rutamant;
      this.vglobal.titrutaanterior = "Listado";
      this.vglobal.mostrarbreadcrumbs = true;

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
        if (!litemobj.per_adicionar) {
          lcampformctrl.disable();
        }
        this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
      }
      // console.log("ngoninit cuentas 1.3");
      this.tablaForm = this.tablaFormOrig;
      this.onChanges();
      this.inicializaForm();
      //  console.log('Formulario despues de init:');
      //  console.log(this.tablaForm);
    });
  }

  //Inicializar el formulario con valores por defecto y validaciones adicionales a los que vienen del diccionario
  inicializaForm() {
    //Dejar clase iden en 1 nit y nombres y apeelidos en blanco y desabilitados
    // console.log("ngoninit cuentas 1.3 inicializaform 1");
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    // console.log(this.tablaForm);
    lcontrol = this.tablaForm.get("cod_tercer");
    // console.log("ngoninit cuentas 1.3 inicializaform 2");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    lcontrol._updateOn = "blur";
    avalida.push(Validators.required);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_tercer", avalida);
    //como es el mismo para otros requeridos unicamente se llama con mismo arreglao avalida
    this.libmantab.defineValidaCampo(this.tablaForm, "direccion", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "telefono", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "id_contapri", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "propiedad", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_acteic", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_vended", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_zona", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "lista_prec", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_fpago", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_pais", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_ciudad", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "estado", avalida);

    //para campos nombres y apellidos limpiar validadores y asignar blanco
    // console.log("ngoninit cuentas 1.3 inicializaform 3");
    // this.libmantab.asignaValorcampoform(this.tablaForm, "cod_ciudad", "11001");

    this.inicializado = true;
        
  }
  //Si cambia el codigo llenar el campo estado a Nuevo
  onChanges(): void {
    this.tablaForm.get("cod_tercer").valueChanges.subscribe(val => {
      var lcontrol: any;
      lcontrol = this.tablaForm.get("cod_tercer");
      if (lcontrol.value) {
        // console.log("set val lleno: "+lcontrol.value);
        this.validacuenta(val, "cod");
      } else {
        // lcontrol.setValue("0");
      }
    });
  }

  onSubmit() {
    this.enerror = false;
    this.grabo = false;
    this.grabando = true;
    this.enlistaerror = false;
    this.regTabla = this.saveregTabla();
    this.mantbasicaService
      .postregTabla(
        this.regTabla,
        this.ptablab,
        this.paplica,
        this.pcampollave,
        this.pclase_nbs,
        this.pclase_val,
        this.pcamponombre
      )
      .subscribe(
        newpro => {
          this.grabando = false;
          var result0 = newpro[0];
          if (typeof newpro.isCallbackError != "undefined") {
            this.grabo = false;
            this.enlistaerror = true;
            this.listaerrores = newpro.messages;
          } else {
            this.grabo = true;
            this.tablaForm.reset();
            this.showMensaje("Se adiciono cuenta.");
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

  validacuenta(valor, ptipo) {
    //ptipo id: buscar id_cuentacrm solo al iniciar de resto trabaja con cod cod_tercer
    //se valida por codigo de tercero y se guarda codigo y id
    var lcontrolcampo: any;
    var lvalor: any;
    var lcampobusca: string;
    lvalor = valor;
    console.log("validacuenta 1 valor:" + valor);
    lcontrolcampo = this.tablaForm.controls["cod_tercer"];
    console.log(lcontrolcampo);
    // console.log("validacuenta 3");
    if (ptipo === "id") {
      lcampobusca = "id_cuentacrm";
    } else {
      lcampobusca = "cod_tercer";
    }
    console.log("validacuenta 2.1 " );
    if (lvalor) {
      console.log("validacuenta 2.2 lcampobusca:"+lvalor );
      this.mantbasicaService
      .getregTabla(lvalor, "TERCEROS", "21", "cod_tercer", "", "", "nombre")
      .subscribe(regTabla => {
        console.log("validacuenta 2.3 " );
        console.log(regTabla);
        if (typeof regTabla != "undefined") {
          this.regTercero = regTabla;
          this.id_terconsulta = regTabla.cod_tercer;
          console.log("validacuenta 2.4 " );
          console.log(this.regTercero);
          //cambiar solo si esta vacio o no definido usar asignaValorcampoformsindato de lo contrario asignaValorcampoform
          // this.libmantab.asignaValorcampoform(this.tablaForm, "nombre", this.regTercero.nombre)
            console.log("validacuenta 2.5 " );
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"nombre",this.regTercero.nombre);
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"url_empre",this.regTercero.homepage);
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_pais",this.regTercero.cod_pais);
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_ciudad",this.regTercero.cod_ciudad);
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_acteic",this.regTercero.cod_acteic);
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"telefono",this.regTercero.telefono);
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"direccion",this.regTercero.direccion);
          this.inicializado = true;
          //cargar cliente
          this.cargocliente = false;
          this.mantbasicaService.getregTabla(lvalor,"CLIENTES","21","cod_tercer","","","contacto")
            .subscribe(regTabla => {
              if (typeof regTabla != "undefined") {
                this.regCliente = regTabla;
                console.log("validacuenta 2.6 " );
                console.log(this.regCliente);
                //cargar cliente
                  console.log("validacuenta 2.7 " );
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_vended",this.regCliente.cod_vended);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_zona",this.regCliente.cod_zona);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cupo_credi",this.regCliente.cupo_credi);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_fpago",this.regCliente.cod_fpago);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"descuento",this.regCliente.descuento);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"lista_prec",this.regCliente.lista_prec);
                  this.libmantab.asignaValorcampoformsindato(this.tablaForm,"ag_retened",this.regCliente.ag_retened);
                this.cargocliente = true;
                // this.tabstrip.selectTab(0);
              }
            });
          this.tabstrip.selectTab(0);
          this.cargotercero = true;
        }
      });
  } else {
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_tercer", "");
    }
  }

  verCombocod_tercer(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    var lvalorn: any;
    var lncampon: string;
    var lcod_tercerant: string;
    var lcambiadatoster = false;
    // console.log("verCombocod_tercer 1");
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    //guardar tercero antes cambio para saber si cambio y cambia datos relacionados
    lcod_tercerant = lcontrolcampo.value;
    // console.log("verCombocod_tercer 2");
    if (event.length > 0) {
      // console.log("verCombocod_tercer 2.1");
      var result0 = event[0];
      lncampo = "result0." + pcamporetorna;
      lvalor = eval(lncampo);
      // console.log("verCombocod_tercer 2.2");
      if (lvalor) {
        // console.log("verCombocod_tercer 2.2.1.1");
        // lncampon = "result0.nombre";
        // lvalorn = eval(lncampon);
        // this.nom_empre = lvalorn;
        // console.log("verCombocod_tercer 2.2.1-2");
      } else {
        // console.log("verCombocod_tercer 2.2.2.1");
        // console.log(result0);
        lncampo = "result0.id";
        lvalor = eval(lncampo);
        // lncampon = "result0.text";
        // lvalorn = eval(lncampon);
        // this.nom_empre=lvalorn;
        // console.log("verCombocod_tercer 2.2.2.2");
      }
    }
    // else {
    //   console.log("verCombocod_tercer 2.2e");
    //   lvalor = '';
    //   this.nom_empre='Error al traer tercero';
    //   console.log("verCombocod_tercer 2.2e 2");
    // }
    // console.log("verCombocod_tercer lcod_tercerant:" + lcod_tercerant);
    // console.log("verCombocod_tercer lvalor:" + lvalor);

    lcontrolcampo.setValue(lvalor);
    if (lvalor != lcod_tercerant) {
      // console.log("verCombocod_tercer Cambiar datos");
      lcambiadatoster = true;
    }
    //traer el tercero
    this.cargotercero = false;
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService
        .getregTabla(lvalor, "TERCEROS", "21", "cod_tercer", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof regTabla != "undefined") {
            this.regTercero = regTabla;
            this.id_terconsulta = regTabla.cod_tercer;
            // console.log("verCombocod_tercer ant regTercero:");
            // console.log(this.regTercero);
            //cambiar solo si esta vacio o no definido usar asignaValorcampoformsindato de lo contrario asignaValorcampoform
            // this.libmantab.asignaValorcampoform(this.tablaForm, "nombre", this.regTercero.nombre)
            if (lcambiadatoster) {
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"nombre",this.regTercero.nombre);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"url_empre",this.regTercero.homepage);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_pais",this.regTercero.cod_pais);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_ciudad",this.regTercero.cod_ciudad);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_acteic",this.regTercero.cod_acteic);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"telefono",this.regTercero.telefono);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"direccion",this.regTercero.direccion);
            }
            this.inicializado = true;
            //cargar cliente
            this.cargocliente = false;
            this.mantbasicaService.getregTabla(lvalor,"CLIENTES","21","cod_tercer","","","contacto")
              .subscribe(regTabla => {
                if (typeof regTabla != "undefined") {
                  this.regCliente = regTabla;
                  // console.log("verCombocod_tercer ant regCliente:");
                  // console.log(this.regCliente);
                  //cargar cliente
                  if (lcambiadatoster) {
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_vended",this.regCliente.cod_vended);
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_zona",this.regCliente.cod_zona);
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cupo_credi",this.regCliente.cupo_credi);
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_fpago",this.regCliente.cod_fpago);
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"descuento",this.regCliente.descuento);
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"lista_prec",this.regCliente.lista_prec);
                    this.libmantab.asignaValorcampoformsindato(this.tablaForm,"ag_retened",this.regCliente.ag_retened);
                  }
                  this.cargocliente = true;
                  // this.tabstrip.selectTab(0);
                }
              });
            this.tabstrip.selectTab(0);
            this.cargotercero = true;
          }
        });
    }
  }

  verComboclie_pote(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    var lcliepotenant: string;
    var lcambiadatocliepot = false;

    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    //guardar cliente potencia antes cambio para saber si cambio y cambia datos relacionados
    lcliepotenant = lcontrolcampo.value;
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
    lcontrolcampo.setValue(lvalor);
    if (lvalor != lcliepotenant) {
      console.log("verCombocod_tercer Cambiar datos");
      lcambiadatocliepot = true;
    }
    //traer el tercero
    this.cargocliepoten = false;
    // console.log("verComboclie_pote ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService
        .getregTabla(
          lvalor,
          "CLIENPOTEN",
          "21",
          "id_cliepote",
          "",
          "",
          "nom_empre"
        )
        .subscribe(regTabla => {
          if (typeof regTabla != "undefined") {
            this.regCliepoten = regTabla;
            this.id_cliepoten = regTabla.cod_cliepote;
            // console.log("verComboclie_pote ant regCliepoten:");
            // console.log(this.regCliepoten);
            if (lcambiadatocliepot) {
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "id_sectore",
                this.regCliepoten.id_sectore
              );
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "id_sectore",
                this.regCliepoten.id_sectore
              );
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "id_contapri",
                this.regCliepoten.id_contprin
              );
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "ing_anual",
                this.regCliepoten.ing_anual
              );
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "num_emple",
                this.regCliepoten.num_emple
              );
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "cod_acteic",
                this.regCliepoten.cod_acteic
              );
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "direccion",
                this.regCliepoten.direccion
              );
              this.libmantab.asignaValorcampoformsindato(
                this.tablaForm,
                "descripcion",
                this.regCliepoten.descripcion
              );
            }
            // console.log(this.tablaForm);
            this.cargocliepoten = true;
          }
        });
    }
  }

  verCombocod_pais(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
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
    lcontrolcampo.setValue(lvalor);
  }

  verCombosector(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    // console.log("combosector");
    // console.log("event llego verCombosector");
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

  verCombocod_acteic(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
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
    lcontrolcampo.setValue(lvalor);
  }

  verComboorigclie(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
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
    lcontrolcampo.setValue(lvalor);
  }

  verListniv_inter(event, pcamporecibe, pcamporetorna) {
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
  openconsulta(ptipo) {
    this.libmantab.copiaVarcrumbs(this.vglobal);
    if (ptipo == "tercero") {
      this.consultatercero = true;
    } else if (ptipo == "cliepoten") {
      this.consultacliepoten = true;
    }
  }
  public closeconsulta(ptipo) {
    this.libmantab.restauraVarcrumbs(this.vglobal);
    if (ptipo == "tercero") {
      this.consultatercero = false;
    } else if (ptipo == "cliepoten") {
      this.consultacliepoten = false;
    }
  }

  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    this.libmantab.copiaVarcrumbs(this.vglobal);
    if (ptipo == "campana") {
      this.crearcampana = true;
    } else if (ptipo == "sectore") {
      this.crearsectore = true;
    } else if (ptipo == "origencp") {
      this.crearorigencp = true;
    } else if (ptipo == "claxvolven") {
      this.crearclaxvolven = true;
    }    
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    this.libmantab.restauraVarcrumbs(this.vglobal);
    if (ptipo == "campana") {
      this.crearcampana = false;
    } else if (ptipo == "sectore") {
      this.crearsectore = false;
    } else if (ptipo == "origencp") {
      this.crearorigencp = false;
    } else if (ptipo == "claxvolven") {
      this.crearclaxvolven = false;
    } 
  }

}
