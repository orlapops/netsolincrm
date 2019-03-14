import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../../../shared/global';
import { MantbasicaService } from '../../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../../services/mantbasica.libreria';
// import { UpperCaseTextDirective } from '../../../../../netsolinlibrerias/directive/upper-case.directive';
import { varGlobales } from '../../../../../shared/varGlobales';

@Component({
  selector: 'crm-editcontacto',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditregcontactoComponent implements OnInit {
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
  subtitle = '(Editar Registro)';
  confmodifica = false;
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  grabo = false;
  message = "";
  cargando = false;
  resultados = false;
  crearcampana = false;
  crearsectore = false;
  crearorigencp = false;
  creartercero = false;
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
  filtrocontacto: string;
  id_terconsulta: string;
  id_cliepoten: string;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 
  //campos a visualizar de contactos
  public liscampvconta = [
    { titulo: 'Código', campo: 'cod_contac' },
    { titulo: 'Nombres', campo: 'nombres' },
    { titulo: 'Apellidos', campo: 'apellidos' },
    { titulo: 'Tel.Trabajo', campo: 'tel_trabajo' },
    { titulo: 'Email', campo: 'email' }
];
  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient
  ) {
  }

  ngOnInit() {
    // console.log("en ngOnInit editregcontactocial");
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

        let lvart: any;
        lvart = localStorage.getItem(this.varParam);
        let lobjpar = JSON.parse(lvart);
        this.title = lobjpar.titulo;
        this.rutamant = lobjpar.rutamant;
        this.vglobal.titulopag ='Editar: '+this.title;
        this.vglobal.rutaanterior = '/' + this.rutamant;
        this.vglobal.titrutaanterior='Listado';
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
          let lcampformctrl = new FormControl('');
          //adicionar validacion si es obligatorio
          var avalida = [];
          if (litemobj.mensaje_er.length == 0) {
            litemobj.mensaje_er = 'Valor Invalido';
          }
          if (litemobj.obliga) {
            avalida.push(Validators.required);
            //   lcampformctrl.setValidators([Validators.required])
          };
          if (litemobj.type == 'text' && litemobj.longitud > 0) {
            avalida.push(Validators.maxLength(litemobj.longitud));
          }
          if (avalida.length > 0) {
            lcampformctrl.setValidators(avalida);
          }
          //Se debe deshabilitar si no permite modificar o es campo llave
          // console.log("litemobj editar");
          // console.log(litemobj);
          var acllave = lobjpar.campollave.split(",");
          if (acllave.length > 1) {
            // console.log("litemobj editar 1");
            if (!litemobj.per_modificar || acllave[0] == litemobj.name || acllave[1] == litemobj.name) {
              // console.log("litemobj disable 1");
              lcampformctrl.disable();
            }
          } else {
            // console.log("litemobj editar 2");
            if (!litemobj.per_modificar || lobjpar.campollave == litemobj.name) {
              // console.log("litemobj disable 2");
              lcampformctrl.disable();
            }
          }
          this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
        };
        this.tablaForm = this.tablaFormOrig;
        this.onChanges();
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
            var result0 = regTabla[0];
            if (typeof (result0) != "undefined") {
              this.enlistaerror = true;
              this.listaerrores = regTabla;
            } else {
              this.asignaValores(regTabla);
            }
          }, error => {
            this.showError(error);
          })
      });
  }

  asignaValores(preg: any) {
    this.cargando = true;
    this.resultados = false;
    this.libmantab.asignaValoresform(preg, this.tablaForm, this.camposform, false);
    this.inicializaForm(preg);
  }
  //Inicializar el formulario con validaciones adicionales
  inicializaForm(preg: any) {
    //var lcontrol: any;
    console.log('ini form contactos preg');
    console.log(preg);
    
    var avalida = [];
    //lcontrol = this.tablaForm.get('cod_tercer');
    //hacer que el control dispare el onchage solo cuando pierda el foco 
    //lcontrol._updateOn = 'blur';
    avalida.push(Validators.required);
    this.libmantab.defineValidaCampo(this.tablaForm, "nombres", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "apellidos", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_contac", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "tel_trabajo", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "email", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_pais", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_ciudad", avalida);
    console.log(this.tablaForm);
    console.log(this.camposform);

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
    this.grabo = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    this.mantbasicaService.putregTabla(this.regTabla, this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
      .subscribe(newpro => {
        this.grabando = false;
        var result0 = newpro[0];
        // console.log(result0);
        if (typeof (newpro.isCallbackError) != "undefined") {
          this.grabo = false;
          this.confmodifica = false;
          this.enlistaerror = true;
          this.listaerrores = newpro.messages;
        } else {
          this.grabo = true;
          this.confmodifica = true;
          this.showMensaje('Se modifico contacto.');
          // this.router.navigate(['/' + this.rutamant])
        }
      }, error => {
        this.grabando = false;
        this.confmodifica = false;
        this.grabo = false;
        this.showError(error);
      })

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

  //retorna si el campo es el campo llave vcerdadero para que sea disabled el campo llave
  isDisabled(pnomcampo: string) {
    if (this.pcampollave == pnomcampo) {
      return true;
    } else {
      return false;
    }
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
 

 


  public close() {
    this.confmodifica = false;
  }

  public open() {
    this.confmodifica = true;
  }
  openadicion(ptipo) {
    if (ptipo == "campana") {
      this.crearcampana = true;
    } else if (ptipo == "sectore") {
      this.crearsectore = true;
    } else if (ptipo == "origencp") {
      this.crearorigencp = true;
    } else if (ptipo == "tercero") {
      this.creartercero = true;
    }
  }

  public closeadicion(ptipo) {
    if (ptipo == "campana") {
      this.crearcampana = false;
    } else if (ptipo == "sectore") {
      this.crearsectore = false;
    } else if (ptipo == "origencp") {
      this.crearorigencp = false;
    } else if (ptipo == "tercero") {
      this.creartercero = false;
    }
  }

}
