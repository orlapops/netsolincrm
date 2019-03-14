import { Component,Input, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../../../shared/global';
import { MantbasicaService } from '../../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../../services/mantbasica.libreria';
// import { UpperCaseTextDirective } from '../../../../../netsolinlibrerias/directive/upper-case.directive';
import { varGlobales } from '../../../../../shared/varGlobales';

@Component({
  selector: 'crm-vertcontacto',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerregcontactoComponent implements OnInit {
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
  subtitle = '(Ver Registro)';
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  enlistaerror = false;
  listaerrores: any[] = [];
  consulto = false;
  camposform: any;
  varParam: string;
  rutamant: string;
  id: string;
  cargando = false;
  resultados = false;
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
        // console.log(this.varParam);
        lvart = localStorage.getItem(this.varParam);
        let lobjpar = JSON.parse(lvart);
        this.title = lobjpar.titulo;
        //Cambiar titulo 
        NetsolinApp.objtitmodulo.titulo = lobjpar.titulo;

        this.rutamant = lobjpar.rutamant;
        this.vglobal.titulopag ='Consultar: '+this.title;
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
        let lvar = '';
        lvar = localStorage.getItem("DDT" + this.ptablab);
        this.camposform = JSON.parse(lvar);
        for (var litemobj of this.camposform) {
          //Crear campo formulario con valor por default
          let lcampformctrl = new FormControl('');
          //adicionar validacion si es obligatorio
          if (litemobj.obliga) {
            lcampformctrl.setValidators([Validators.required])
          };
          this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
        };
        this.tablaForm = this.tablaFormOrig;
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
            if(typeof(regTabla.isCallbackError) != "undefined") {
              this.consulto=false;
              this.enlistaerror = true;
              this.listaerrores = regTabla.messages;
            } else {  
              this.consulto=true;
              this.asignaValores(regTabla);
            }   
          })
      });

  }

  asignaValores(preg: any) {
    this.cargando = true;
    this.resultados = false;
    this.libmantab.asignaValoresform(preg,this.tablaForm,this.camposform,true);
    this.inicializaForm();
  }

      //Inicializar el formulario con validaciones adicionales
  inicializaForm(){
        //Dejar clase iden en 1 nit y nombres y apeelidos en blanco y desabilitados
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
