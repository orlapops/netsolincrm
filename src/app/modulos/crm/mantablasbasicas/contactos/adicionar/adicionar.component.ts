import { Component, VERSION, OnInit,Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { NetsolinApp } from '../../../../../shared/global';
//(import { UpperCaseTextDirective } from '../../../../../netsolinlibrerias/directive/upper-case.directive';
import { MantbasicaService } from '../../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../../services/mantbasica.libreria';
import { varGlobales } from '../../../../../shared/varGlobales';

@Component({
  selector: 'crm-addcontacto',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.css']
})
export class AddregcontactoComponent implements OnInit {
  @Input() vparcaptura: string;
  //@ViewChild('tabstrip') public tabstrip: TabStripComponent;
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
  subtitle = '(Adicionar Registro)';
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  crearcampana = false;
  crearsectore = false;
  crearorigencp = false;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 

  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private activatedRouter: ActivatedRoute,
    private pf: FormBuilder) 
    {}
    ngOnInit() {
      this.activatedRouter.params.subscribe(parametros => {
        //Cambiar titulo
        NetsolinApp.objtitmodulo.titulo = "Adicionar Cliente potencial";
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
        this.camposform = JSON.parse(lvar);
        for (var litemobj of this.camposform) {
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
        this.tablaForm = this.tablaFormOrig;
        this.onChanges();
        this.inicializaForm();
        //  console.log('Formulario despues de init:');
        //  console.log(this.tablaForm);
      });
    }

  //Inicializar el formulario con valores por defecto adicionales a los que vienen del diccionario
  inicializaForm() {
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    //lcontrol = this.tablaForm.get("id_cliepote");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    //lcontrol._updateOn ="blur";
     //como es el mismo para otros requeridos unicamente se llama con mismo arreglo avalida
    avalida.push(Validators.required);

    this.libmantab.defineValidaCampo(this.tablaForm, "clase_iden", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "nombres", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "apellidos", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_contac", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "tel_trabajo", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "email", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_pais", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_ciudad", avalida);

  
    this.inicializado = true; //Iniciar
  }
  //Se usa para detectar cambios en un campo especifico ejemplo al validar un campo hacer 
  //que se haga algo adicional. En terceros al validar el tercero dejar este mismo en nit si esta vacio
  onChanges(): void {
    //this.tablaForm.get("id_cliepote").valueChanges.subscribe(val => {
      //var lcontrol: any;
      //lcontrol = this.tablaForm.get("estado");
      //if (lcontrol.value) {
        // console.log("set val lleno: "+lcontrol.value);
      //} else {
        //lcontrol.setValue("0");
      //}
    //});
  }
  onSubmit() {    
    //validar que vaya cuenta o cliente potencial
    var lregantgrabar = this.tablaForm.value;
    console.log('onsubmit lregantgrabar:');
    console.log(lregantgrabar);

    if((lregantgrabar.id_cliepoten===null && lregantgrabar.id_cuentacrm===null) || (lregantgrabar.id_cliepoten===0 && lregantgrabar.id_cuentacrm===0))
    {
      this.showError;
      this.showMensaje('Debe definir un cliente potencial o una cuenta para el contacto');
      return;    
    }

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
            this.showMensaje("Se adiciono Contactos.");
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
    return '/' + this.rutamant;
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

  verComboid_cliepote(event, pcamporecibe, pcamporetorna) {
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

  verComboid_cuenta(event, pcamporecibe, pcamporetorna) {
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

  verListclase_iden(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verListestado_civ(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verListsexo(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verListmetodo_cont(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
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


}
