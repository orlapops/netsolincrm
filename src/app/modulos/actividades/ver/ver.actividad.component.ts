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
  selector: 'ver-actividad',
  templateUrl: './ver.actividad.component.html',
  styleUrls: ['./ver.actividad.component.css']
})
export class VerregactividadComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
  //Modulo asociado a la actividad 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
  @Input() modulo_asoc: number;
  //id del modulo al que se asocia la actividad
  @Input() id_modasoc: number;
 
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  title: string;
  subtitle = '(Ver Actividad)';
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
        console.log(this.varParam);
        lvart = localStorage.getItem(this.varParam);
        let lobjpar = JSON.parse(lvart);
        console.log(lobjpar);
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
        console.log(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre);
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
            if (typeof (regTabla.isCallbackError) != "undefined") {
              console.error(regTabla.messages);
              this.consulto = false;
              this.enlistaerror = true;
              this.listaerrores = regTabla.messages;
            } else {
              this.consulto = true;
              console.log('reg: ',regTabla);
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
      //Modulo asociado a la actividad 1-contactos,2-cliente potencial,3-cuenta,4-cotizacion,5-pedido
      this.modulo_asoc=preg.mod_asociado;
      this.id_modasoc=preg.id_modasocia;      
      console.log("ngoninit cuentas 1.3 inicializaform 21 typeof:"+typeof(this.id_modasoc));
      switch(this.modulo_asoc.toString()) { 
      case "1": { 
        //  this.carga_contacto()
         break; 
      } 
      case "2": { 
        // this.carga_cliepoten()
        this.mantbasicaService.getregTabla(this.id_modasoc,"CLIENPOTEN","21","id_cliepote","","","nom_empre")
        .subscribe(regTabla => {
          if (typeof regTabla != "undefined") {
            this.regModasoc = regTabla;
            this.labelmodasoc = 'Consultando actividad para clie poten: '+regTabla.cod_cliepote+'/'+regTabla.nom_empre;
            this.cargomodasoc = true;            
            this.resultados = true;
          }
        });
         break; 
      } 
      case "3": { 
        // this.carga_cuenta()
        this.mantbasicaService.getregTabla(this.id_modasoc,"CUENTACRM","21","id_cuentacrm","","","nombre")
        .subscribe(regTabla => {
          if (typeof regTabla != "undefined") {
            this.regModasoc = regTabla;
            this.labelmodasoc = 'Consultando actividad para cuenta: '+regTabla.cod_tercer+'/'+regTabla.nombre;
            this.cargomodasoc = true;            
            this.resultados = true;
          }
        });
         break; 
      } 
      case "4": { 
        //carga cotización
       this.mantbasicaService.getregTabla(this.id_modasoc,"COTIZACRM_C","21","id_cotiza","","","num_dcotiz")
        .subscribe(regTabla => {
          if (typeof regTabla != "undefined") {
            this.regModasoc = regTabla;
            this.labelmodasoc = 'Consultando actividad para cotización: '+regTabla.cod_dcotiz+'/'+regTabla.num_dcotiz;
            this.cargomodasoc = true;            
            this.resultados = true;
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
   console.log("ngoninit cuentas 1.3 inicializaform 4");
    this.cargando = false;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }


  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
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
