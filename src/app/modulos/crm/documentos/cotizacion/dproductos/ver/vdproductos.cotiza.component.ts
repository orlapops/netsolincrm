import { Component,Input, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../../../../shared/global';
import { Netsbuscombogcampo } from '../../../../../../netsolinlibrerias/netsbuscombog/netsbuscombogcampo.componente';
import { MantbasicaService } from '../../../../../../services/mantbasica.service';
import { NetsolinService } from '../../../../../../services/netsolin.service';
import { MantablasLibreria } from '../../../../../../services/mantbasica.libreria';
import { UpperCaseTextDirective } from '../../../../../../netsolinlibrerias/directive/upper-case.directive';
import { varGlobales } from "../../../../../../shared/varGlobales";

@Component({
  selector: 'crm-verdcotiza',
  templateUrl: './vdproductos.cotiza.component.html',
  styleUrls: ['./vdproductos.cotiza.component.css']
})
export class VerregdprodcotizaComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() idccotiza: string;
  @Input() vid: any;
  @ViewChild("txtCodrefven") txtCodrefven: Netsbuscombogcampo;

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
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  consulto = false;
  camposform: any;
  varParam: string;
  rutamant: string;
  consultarefere = false;
  consultaprodfc = false;
  nom_empre: string;
  cargocotizac = false;
  regCotizac: any;
  cargorefere = false;
  regReferen: any;
  labelcod_refven: string = "";
  cargoprod = false;
  regProdfc: any;
  cargoprocven = false;
  regProcven: any;
  id_refconsulta: string;
  id_dcotiza: string;
  valor_bruto: number = 0;
  valor_descuento: number = 0;
  valor_iva: number = 0;
  valor_neto: number = 0;
  valor_total: number = 0;
  por_iva = 0;
  llamabuscarrefere = false;
  llamabuscarprod = false;
  referebuscar: string = "";
  prodfcbuscar: string = "";
  disablecod_prod = false;
  prod_catalogo = true;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 
  id: string;
  cargando = false;
  resultados = false;
  
  constructor(private mantbasicaService: MantbasicaService,
    private service: NetsolinService,
    public libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    public vglobal: varGlobales,
    private httpc: HttpClient
  ) {
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(parametros => {
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
              console.log('ngonit regtabla');
              console.log(regTabla);
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
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    this.prod_catalogo = preg.prod_catal;
    this.por_iva = preg.por_iva;
    console.log('inicializaForm preg');
    console.log(preg);

    if (preg.prod_catal){      
      this.cargorefere = false;
      this.cargoprod = false;
      this.mantbasicaService.getregTabla(preg.cod_refven, "REFERE_V", "10", "cod_refven", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof (regTabla) != "undefined") {
            this.regReferen = regTabla;
            // console.log('inicializaForm getregTablaREFERE_V  regTabla');
            // console.log(regTabla);
                    //disable se vuelve a evaluar al modificar referencia
            this.libmantab.disableCampoform(this.tablaForm, "valor_list");
            this.id_refconsulta = regTabla.cod_refven;
            this.cargorefere = true;
          }
        })
    } else {
      this.cargorefere = false;
      this.cargoprod = false;
      this.mantbasicaService.getregTabla(preg.cod_prod,"PRODUCTOS","21","cod_prod", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof (regTabla) != "undefined") {
            this.regProdfc = regTabla;
            console.log('inicializaForm getregTabla PRODUCTOS  regTabla');
            console.log(regTabla);
            //disable se vuelve a evaluar al modificar referencia
            this.libmantab.disableCampoform(this.tablaForm, "valor_list");           
            this.cargoprod = true;
          }
        })
    }
    this.message = "";
    this.enerror = false;
    this.cargocotizac = false;
    this.mantbasicaService.getregTabla(this.idccotiza,"COTIZACRM_C","21","id_cotiza","","","num_dcotiz")
      .subscribe(regTabla => {
        if (typeof regTabla != "undefined") {
          this.regCotizac = regTabla;
          this.libmantab.asignaValorcampoform(this.tablaForm,"id_cotiza",regTabla.id_cotiza);
          this.libmantab.asignaValorcampoform(this.tablaForm,"cod_dcotiz",regTabla.cod_dcotiz);
          this.libmantab.asignaValorcampoform(this.tablaForm,"num_dcotiz",regTabla.num_dcotiz);
          this.libmantab.asignaValorcampoform(this.tablaForm,"fec_dcotiz",regTabla.fec_dcotiz);
          //Cargar el procedimiento de ventas de la cotización
          this.cargoprocven = false;
          this.mantbasicaService.getregTabla(this.regCotizac.cod_procve,"PROC_VEN","10","cod_procve","","","nombre")
            .subscribe(regTabla => {
              if (typeof regTabla != "undefined") {
                this.regProcven = regTabla;
              //   console.log('inicializaForm getregTabla PROC_VEN  regTabla');
              //   console.log(regTabla);
              //  console.log('this.por_iva antes del procedimiento');
              //   console.log(this.por_iva);                
                //Se quita por que cambia el valor anteriormente guardado
//                this.por_iva = this.regProcven.por_iva;
// console.log('this.por_iva des procedimiento');
// console.log(this.por_iva);                
                this.cargoprocven = true;
                this.cargocotizac = true;
                this.resultados = true;
                this.calculosItem();
              }
            });
          // this.tabstrip.selectTab(0);
        }
      });
    
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }
  calculosItem() {
    var lcontrol: any;
    lcontrol = this.tablaForm.get("cantidad_c");
    var lcantidad: number = lcontrol.value;
    lcontrol = this.tablaForm.get("valor_list");
    var lvalunit: number = lcontrol.value;
    lcontrol = this.tablaForm.get("por_desc");
    var lpordesc: number = lcontrol.value;
    this.valor_bruto = lcantidad * lvalunit;
    this.valor_descuento = this.valor_bruto * lpordesc / 100;
    this.valor_neto = this.valor_bruto - this.valor_descuento;
    this.valor_iva = this.valor_neto * this.por_iva/100;
    this.valor_total = this.valor_neto + this.valor_iva;
  }

  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
  }
  retornafiltro(ptabla) {
    // console.log('retornafiltro: 1');
    if (ptabla == "PRODUCTOS") {
      if (NetsolinApp.oapp.motor == 3) {
        // console.log('retornafiltro:  inactivo=0');
        return "inactivo=0";
      } else {
        return "inactivo=false";
      }
      // console.log('retornafiltro: 3');
    } else {
      return "*";
    }
  }    
}
