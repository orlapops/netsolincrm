import { Component,Input, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { NetsolinApp } from '../../../shared/global';
import { MantbasicaService } from '../../../services/mantbasica.service';
import { NetsolinService } from '../../../services/netsolin.service';
import { MantablasLibreria } from '../../../services/mantbasica.libreria';
import { varGlobales } from "../../../shared/varGlobales";

@Component({
  selector: 'ver-archivosadj',
  templateUrl: './ver.archivosadj.component.html',
  styleUrls: ['./ver.archivosadj.component.css']
})
export class VerregarchivosadjComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
  //Modulo asociado a la archivosadj 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
  @Input() modulo_asoc: number;
  //id del modulo al que se asocia la archivosadj
  @Input() id_modasoc: number;
 
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  title: string;
  subtitle = '(Ver archivosadj)';
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
  cargomodasoc = false;
  regModasoc: any;
  labelmodasoc: string="";
  
  constructor(private mantbasicaService: MantbasicaService,
    public libmantab: MantablasLibreria,
    private pf: FormBuilder,
    public vglobal: varGlobales,
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
        this.rutamant = lobjpar.rutamant;
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
            if (typeof (regTabla.isCallbackError) != "undefined") {
              this.consulto = false;
              this.enlistaerror = true;
              this.listaerrores = regTabla.messages;
            } else {
              this.consulto = true;
              this.asignaValores(regTabla);
            }
          })
      });

  }

  asignaValores(preg: any) {
    this.cargando = true;
    this.resultados = false;
    this.libmantab.asignaValoresform(preg, this.tablaForm, this.camposform, true);
    this.inicializaForm(preg);
  }

  //Inicializar el formulario con validaciones adicionales
  inicializaForm(preg: any) {
    //dependiendo del modulo asociado traer el registro 
      //Modulo asociado a la archivosadj 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
      this.modulo_asoc=preg.mod_asociado;
      this.id_modasoc=preg.id_modasocia;  
      this.resultados=true;    
      // console.log("ngoninit cuentas 1.3 inicializaform 21 typeof:"+typeof(this.id_modasoc));
     this.cargando = false;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }


  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
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
}
