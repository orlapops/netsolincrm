import {Component,VERSION,OnInit,Input,ViewChild,ElementRef} from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { NetsolinApp } from '../../../shared/global';
import { Netsbuscombogcampo } from '../../../netsolinlibrerias/netsbuscombog/netsbuscombogcampo.componente';
import { MantbasicaService } from '../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../services/mantbasica.libreria';
import { UpperCaseTextDirective } from '../../../netsolinlibrerias/directive/upper-case.directive';
import { NetsolinService } from "../../../services/netsolin.service";
import { varGlobales } from "../../../shared/varGlobales";

@Component({
  selector: 'edit-actividad',
  templateUrl: './edit.actividad.component.html',
  styleUrls: ['./edit.actividad.component.css']
})
export class EditregactividadComponent implements OnInit {
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
  subtitle = '(Editar Actividad)';
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
  nom_empre: string;
  cargomodasoc = false;
  regModasoc: any;
  labelmodasoc: string="";
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 

  constructor(private mantbasicaService: MantbasicaService,
    public libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    public vglobal: varGlobales,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient
  ) {
  }

  ngOnInit() {
    // console.log("en ngOnInit editregActiviad 1");
    // console.log('this.vparcaptura:'+this.vparcaptura);
    // console.log('this.vid:'+this.vid);
    this.activatedRouter.params
      .subscribe(parametros => {
        // console.log("en ngOnInit editregActiviad 2");
        // this.varParam = parametros['varParam'];
        // this.id = parametros['id'];

        if (this.vparcaptura) {
          // console.log("en ngOnInit editregActiviad 2.1");
          this.varParam = this.vparcaptura;
        } else {
          // console.log("en ngOnInit editregActiviad 2.2");
          this.varParam = parametros['varParam'];
        }
        // this.id = parametros['id'];
        if (this.vparcaptura) {
          this.id = this.vid;
        } else {
          this.id = parametros['id'];
        }
        // console.log("en ngOnInit editregActiviad 3");

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
        let lvar = '';
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
          var acllave = lobjpar.campollave.split(',');
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
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    lcontrol = this.tablaForm.get('tipo_act');
    //hacer que el control dispare el onchage solo cuando pierda el foco 
    lcontrol._updateOn = 'blur';
    avalida.push(Validators.required);
    this.libmantab.defineValidaCampo(this.tablaForm, "tipo_act", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "asunto", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "descripcion", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "prioridad", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "estado", avalida);
    this.cargomodasoc = false;
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
         break; 
      } 
      case "3": { 
        // this.carga_cuenta()
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
            this.labelmodasoc = 'Modificando actividad para cotización: '+regTabla.cod_dcotiz+'/'+regTabla.num_dcotiz;
            this.regModasoc = regTabla;
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
          this.showMensaje('Se modifico actividad.');
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

  public close() {
    this.confmodifica = false;
  }

  public open() {
    this.confmodifica = true;
  }
  openconsulta(ptipo){
  }
  public closeconsulta(ptipo) {
  }

  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
  }
  //maneja el control para cerrar
  public closeadicion(ptipo) {
  }
}
