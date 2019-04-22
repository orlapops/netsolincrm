import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../../../../shared/global';
import { Netsbuscombogcampo } from '../../../../../../netsolinlibrerias/netsbuscombog/netsbuscombogcampo.componente';
import { MantbasicaService } from '../../../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../../../services/mantbasica.libreria';
import { UpperCaseTextDirective } from '../../../../../../netsolinlibrerias/directive/upper-case.directive';
import { NetsolinService } from "../../../../../../services/netsolin.service";
import { varGlobales } from "../../../../../../shared/varGlobales";

@Component({
  selector: 'crm-editdcotiza',
  templateUrl: './edproductos.cotiza.component.html',
  styleUrls: ['./edproductos.cotiza.component.css']
})
export class EditregdprodcotizaComponent implements OnInit {
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
  subtitle = '(Editar Registro)';
  confmodifica = false;
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  grabo = false;
  message = "";
  menalerta = '';
  crearrefere = false;
  crearprodfc = false;
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
  inicializado=false;
  
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
    // console.log("en ngOnInit editregcuentacial");
    this.activatedRouter.params.subscribe(parametros => {
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
          if (litemobj.name==='cod_refven' || litemobj.name==='cod_prod'){
            //si es producto por defecto referencia obligatoria  se hace en inicializaForm

        } else {        
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
    var avalidanumero = [];    
    var lcontrol: any;
    lcontrol = this.tablaForm.get('cod_refven');
    //hacer que el control dispare el onchage solo cuando pierda el foco 
    lcontrol._updateOn = 'blur';
    avalida.push(Validators.required);
    this.prod_catalogo = preg.prod_catal;
    this.por_iva = preg.por_iva;
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
                //No debe cambiar el % debe respetar el guardado ant
                //this.por_iva = this.regProcven.por_iva;
                this.cargoprocven = true;
                this.cargocotizac = true;
                this.inicializado = true;
                //llamar onchange solo despues de inicializado
                this.onChanges();
              }
            });
            if (preg.prod_catal){      
              this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", avalida);
              this.libmantab.defineValidaCampo(this.tablaForm, "cod_prod", []);
              this.cargorefere = false;
              this.cargoprod = false;
              this.mantbasicaService.getregTabla(preg.cod_refven, "REFERE_V", "10", "cod_refven", "", "", "nombre")
                .subscribe(regTabla => {
                  if (typeof (regTabla) != "undefined") {
                    this.regReferen = regTabla;
                    //Actualizar precio si es el caso
                    this.actualizar_precioalinicia();
                    //disable se vuelve a evaluar al modificar referencia
                    this.libmantab.disableCampoform(this.tablaForm, "valor_list");
                    this.id_refconsulta = regTabla.cod_refven;
                    this.cargorefere = true;
                  }
                })
            } else {
              this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", []);
              this.libmantab.defineValidaCampo(this.tablaForm, "cod_prod", avalida);
              avalidanumero.push(Validators.min(0));
              avalidanumero.push(Validators.max(360));
              this.libmantab.defineValidaCampo(this.tablaForm, "tmp_entreg", avalidanumero);        
              this.cargorefere = false;
              this.cargoprod = false;
              this.mantbasicaService.getregTabla(preg.cod_prod,"PRODUCTOS","21","cod_prod", "", "", "nombre")
                .subscribe(regTabla => {
                  if (typeof (regTabla) != "undefined") {
                    this.regProdfc = regTabla;
                    //disable se vuelve a evaluar al modificar referencia
                    this.libmantab.disableCampoform(this.tablaForm, "valor_list");           
                    this.cargoprod = true;
                  }
                })
            }
          // this.tabstrip.selectTab(0);
        }
      });
        


    this.cargando = false;
    this.resultados = true;
  }
  actualizar_precioalinicia(){
            //op abril 22 2019 verificar precio
            NetsolinApp.param_precioven.cod_tercer = this.regCotizac.cod_tercer;
            NetsolinApp.param_precioven.proc_ven = this.regCotizac.cod_procve;
            NetsolinApp.param_precioven.lista = this.regCotizac.cod_lista;
            NetsolinApp.param_precioven.cod_refven = this.regReferen.cod_refven;
            this.service.getNetsolinObjconParametros(this.vglobal.obj_precio,NetsolinApp.param_precioven)
              .subscribe(result => {
                  //viene registro con el precio o error
                  console.log("eje getNetsolinObjconParametros retorna result");
                  console.log(result);
                  var result0 = result[0];
                  // console.log(result0);
                  if (typeof result.isCallbackError === "undefined") {       
                    //viene el registro con el precio en result0
                    var lprecio = this.libmantab.valCampoform(this.tablaForm,"valor_list");
                    //Op Abril 22 19 no debe cambiar estos datos sin avisar
                    console.log('Actualizando precio lprecio,result0.valor',lprecio,result0.valor);
                    if (lprecio != result0.valor){
                      this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",result0.valor);
                      this.menalerta = 'El precio cambio. Se actualiza el precio. Verifique'
                      // this.libmantab.asignaValorcampoform(this.tablaForm,"por_desc",result0.descuento);
                    }
                    //op Abril 22 2019 cambio validator a descuento maximo si existe campo definido des_max en lista de precios y es verdadero
                    if (typeof result0.des_max != "undefined" && result0.des_max) {
                        console.log('Se asigna como descuento maximo',result0);
                        this.tablaForm.controls['por_desc'].setValidators([Validators.min(0), Validators.max(result0.descuento)]);  
                    }                      
                    if (result0.valor > 0) {
                      if (result0.fijo)
                          this.libmantab.disableCampoform(this.tablaForm,"valor_list");                       
                      else 
                        this.libmantab.enableCampoform(this.tablaForm,"valor_list");                       
                    } else
                      this.libmantab.enableCampoform(this.tablaForm,"valor_list");                       
                    
                    if (result0.des_fijo) {
                      this.libmantab.disableCampoform(this.tablaForm,"por_desc");                       
                    } else {
                      this.libmantab.enableCampoform(this.tablaForm,"por_desc");                                               
                    }
                    if (this.regCotizac.inc_iva)
                      this.por_iva = result0.por_iva;
                    else 
                      this.por_iva = 0;
                    

                  } else {
                    //viene el registro con el error
                    this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
                    var regerror = result.messages[0];
                    this.message = regerror.menerror;
                    this.showError(regerror.menerror);
                  }
                },
                error => {
                  this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
                  console.log("Error en getNetsolinObjconParametros");
                  console.log(error);
                  this.showError(error);
                }
              );            
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
    this.tablaForm.get("cod_refven").valueChanges.subscribe(val => {
      var lcontrol: any;
      // lcontrol = this.tablaForm.get('estado');
      // if (lcontrol.value) {
      //   // console.log("set val lleno: "+lcontrol.value);
      // }
      // else {
      //   lcontrol.setValue('0');
      // }
    });

    this.tablaForm.get("prod_catal").valueChanges.subscribe(val => {
      //si cambia check producto de catalogo
      // console.log("onchange prod_catal");
      // console.log(val);
      if (this.grabando)
          return;
      this.message = "";
      this.enerror = false;
      //asignar valor del check a prod catalogo 
      this.prod_catalogo = val;
      var avalida = [];
      avalida.push(Validators.required);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"por_desc",0);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"cantidad_c",0);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
      // this.libmantab.asignaValorcampoform(this.tablaForm,"por_iva",0);      

      if (this.prod_catalogo) {
        //si es producto de catalogo limpiar campos de prod fuera de catalogo 
        // hacer obligatorio campo referencia. Y no obligatorio el campo del producto fuera de catalogo
        this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
        // console.log('descrip a vacio en onchange prod_catal ');
        // this.libmantab.asignaValorcampoform(this.tablaForm, "descrip", "");
        this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", avalida);
        this.libmantab.defineValidaCampo(this.tablaForm, "cod_prod", []);
        this.cargoprod = false;
 
        // let vcontrolref = this.tablaForm.controls["cod_refven"];
        // console.log("control cod_refven al hacer por referencia");
        // console.log(vcontrolref);
        // let vcontrolprod = this.tablaForm.controls["cod_prod"];
        // console.log("control cod_prod al hacer por referencia");
        // console.log(vcontrolprod);
            
      } else {
        //si es producto fuera de catalogo limpiar campos de referencia prod  de catalogo 
        // hacer obligatorio campo producto fuera de catalogo. Y no obligatorio el campo de referencia
        this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", []);
        this.libmantab.asignaValorcampoform(this.tablaForm, "cod_refven", "");
        // console.log('descrip a vacio en onchange prod_catal else');
        
        // this.libmantab.asignaValorcampoform(this.tablaForm, "descrip", "");
        this.libmantab.defineValidaCampo(this.tablaForm, "cod_prod", avalida);
        this.labelcod_refven = "";
        this.cargorefere = false;
        // let vcontrolref = this.tablaForm.controls["cod_refven"];
        // console.log("control cod_refven al hacer por producto");
        // console.log(vcontrolref);
        // let vcontrolprod = this.tablaForm.controls["cod_prod"];
        // console.log("control cod_prod al hacer por producto");
        // console.log(vcontrolprod);
      }
    });

    this.tablaForm.get("cantidad_c").valueChanges.subscribe(val => {
      if (this.grabando)
          return;
      this.calculosItem();
    });
    this.tablaForm.get("valor_list").valueChanges.subscribe(val => {
      if (this.grabando)
          return;
      this.calculosItem();
    });
    this.tablaForm.get("por_desc").valueChanges.subscribe(val => {
      if (this.grabando)
          return;
      this.calculosItem();
    });

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

  onSubmit() {
    var lcontrol: any;
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.calculosItem();
    this.grabando = true;
    //asignar otros valores antes de grabar
    this.libmantab.asignaValorcampoform(this.tablaForm, "por_iva", this.por_iva);
    this.libmantab.asignaValorcampoform(this.tablaForm, "iva", this.valor_iva);
    this.libmantab.asignaValorcampoform(this.tablaForm,"valor_neto",this.valor_neto);
    this.libmantab.asignaValorcampoform(this.tablaForm,"descuento",this.valor_descuento);
    lcontrol = this.tablaForm.get("cantidad_c");
    var lcantidad: number = lcontrol.value;
    lcontrol = this.tablaForm.get("cod_umed_c");
    var lcod_umed: string = lcontrol.value;
    this.libmantab.asignaValorcampoform(this.tablaForm, "cod_umed", lcod_umed);
    // this.libmantab.asignaValorcampoform(this.tablaForm, "cod_umed_c", lcod_umed);
    this.libmantab.asignaValorcampoform(this.tablaForm, "cantidad", lcantidad);
    // this.libmantab.asignaValorcampoform(this.tablaForm, "cantidad_c", lcantidad);
    var numdocint = Math.floor(Math.random() * 999999);
    this.libmantab.asignaValorcampoform(this.tablaForm,"id_cotizad",numdocint);
    console.log('datos a grabar antes enable');
    console.log(this.tablaForm.value)
    
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
          this.confmodifica = false;
          this.showMensaje('Se modifico cuenta.');
          // this.router.navigate(['/' + this.rutamant])
        }
      }, error => {
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
  verCombocod_prod(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    // console.log("verCombocod_prod 1");
    // console.log(event);
    this.cargorefere = false;
    this.cargoprod = false;
    this.message = "";
    this.enerror = false;
    //asegurarse que cod_refven quede vacio y sin ser obligatorio
    this.libmantab.asignaValorcampoform(this.tablaForm, "cod_refven", "");
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", []);

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
        lvalor = event;
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
    if (lvalor) {
      this.mantbasicaService
        .getregTabla(lvalor, "PRODUCTOS", "21", "cod_prod", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof regTabla.isCallbackError === "undefined") {
            this.regProdfc = regTabla;
            // this.id_refconsulta = regTabla.cod_prod;
            // this.labelcod_refven = regTabla.nombre
            this.cargoprod = true;
            // var lprecio =  this.libmantab.valCampoform(this.tablaForm,'valor_list');
            // console.log("cargo producto 2 lprecio:"+lprecio);
            // if (lprecio===0){
            // console.log("cargo producto 3");
            this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",this.regProdfc.precio_ven);
            if (this.regProdfc.precio_ven > 0) {
              // console.log("cargo producto 4");
              this.libmantab.disableCampoform(this.tablaForm, "valor_list");
            } else
              this.libmantab.enableCampoform(this.tablaForm, "valor_list");            
            // console.log('se habilita captura por_desc');
            this.libmantab.enableCampoform(this.tablaForm,"por_desc");                                               
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_umed",this.regProdfc.cod_umed);
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_umed_c",this.regProdfc.cod_umed);
            this.libmantab.asignaValorcampoform(this.tablaForm,"descrip",this.regProdfc.nombre);
            // console.log('descrip a val nom prodf en onchange prod_catal ');
            if (this.regCotizac.inc_iva)
              this.por_iva = this.regProdfc.por_iva;
            else 
              this.por_iva = 0;

            // }
            // console.log("cargo producto 5");
          } else {
            // console.log("llega con error no encontro limpiar");
            // console.log('add producto dejando en blanco nativeElement');
            // console.log(this.txtCodrefven);
            // console.log(this.txtCodrefven.inputbus.nativeElement);
            this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
            this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
          }
        });
    } else {
      //ad producto
      // console.log("add producto dejando en blanco nativeElement");
      // console.log(this.txtCodrefven);
      // console.log(this.txtCodrefven.inputbus.nativeElement);
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
      this.libmantab.asignaValorcampoform(this.tablaForm, "valor_list", 0);
    }
  }

  verCombocod_refven(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    var lvalorn: any;
    var lncampon: string;
    var lcod_refant: string;
    var lcambiadatosref = false;
    this.cargoprod = false;
    this.message = "";
    this.enerror = false;
    // console.log("verCombocod_refven 1");
    // console.log(event);
    //asegurarse que cod_prod quede vacio y sin ser obligatorio
    this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_prod", []);
    
    // console.log(event.cbuscar);
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    //guardar ref antes cambio para saber si cambio y cambia datos relacionados
    lcod_refant = lcontrolcampo.value;
    // console.log("verCombocod_refven 2");
    if (event.cbuscar.length > 0) {
      // console.log("verCombocod_refven 2.1");
      lvalor = event.cbuscar;
      // console.log("verCombocod_refven 2.2");
      if (lvalor) {
        // console.log("verCombocod_refven 2.2.1.1");
        // lncampon = "result0.nombre";
      } else {
        // console.log("verCombocod_refven 2.2.2.1");
        // console.log(result0);
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    }
    lcontrolcampo.setValue(lvalor);
    if (lvalor != lcod_refant) {
      // console.log("verCombocod_tercer Cambiar datos");
      lcambiadatosref = true;
    }
    //traer referencia
    this.cargorefere = false;
    this.labelcod_refven = "";
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService
        .getregTabla(lvalor, "REFERE_V", "10", "cod_refven", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof regTabla.isCallbackError == "undefined") {
            this.regReferen = regTabla;
            this.id_refconsulta = regTabla.cod_refven;
            this.labelcod_refven = regTabla.nombre;
            this.cargorefere = true;
            // console.log("verCombocod_tercer ant regTercero:");
            // console.log(this.regTercero);
            //cambiar solo si esta vacio o no definido usar asignaValorcampoformsindato de lo contrario asignaValorcampoform
            // this.libmantab.asignaValorcampoform(this.tablaForm, "nombre", this.regTercero.nombre)
            // if (lcambiadatosref) {
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_umed",this.regReferen.cod_umed);
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"cod_umed_c",this.regReferen.cod_umed);
              // console.log('descrip a vacio en vercombo ref ventas ');
              this.libmantab.asignaValorcampoformsindato(this.tablaForm,"descrip",this.regReferen.nombre);
              //cargar lista de precios
              this.regCotizac.cod_lista;
              //llenar parametros para consultar lista de precios
              NetsolinApp.param_precioven.cod_tercer = this.regCotizac.cod_tercer;
              NetsolinApp.param_precioven.proc_ven = this.regCotizac.cod_procve;
              NetsolinApp.param_precioven.lista = this.regCotizac.cod_lista;
              NetsolinApp.param_precioven.cod_refven = this.regReferen.cod_refven;

              this.service.getNetsolinObjconParametros(this.vglobal.obj_precio,NetsolinApp.param_precioven)
                .subscribe(result => {
                    //viene registro con el precio o error
                    // console.log("eje getNetsolinObjconParametros retorna result");
                    // console.log(result);
                    var result0 = result[0];
                    // console.log(result0);
                    if (typeof result.isCallbackError === "undefined") {       
                      //viene el registro con el precio en result0
                      var lprecio = this.libmantab.valCampoform(this.tablaForm,"valor_list");
                      //Op Abril 22 19 no debe cambiar estos datos sin avisar
                      console.log('Actualizando precio lprecio,result0.valor',lprecio,result0.valor);
                      if (lprecio != result0.valor){
                        this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",result0.valor);
                        this.menalerta = 'El precio cambio. Se actualiza el precio. Verifique'
                        // this.libmantab.asignaValorcampoform(this.tablaForm,"por_desc",result0.descuento);
                      }
                      //op Abril 22 2019 cambio validator a descuento maximo si existe campo definido des_max en lista de precios y es verdadero
                      if (typeof result0.des_max != "undefined" && result0.des_max) {
                          console.log('Se asigna como descuento maximo',result0);
                          this.tablaForm.controls['por_desc'].setValidators([Validators.min(0), Validators.max(result0.descuento)]);  
                      }                      
                      if (result0.valor > 0) {
                        if (result0.fijo)
                            this.libmantab.disableCampoform(this.tablaForm,"valor_list");                       
                        else 
                          this.libmantab.enableCampoform(this.tablaForm,"valor_list");                       
                      } else
                        this.libmantab.enableCampoform(this.tablaForm,"valor_list");                       
                      
                      if (result0.des_fijo) {
                        this.libmantab.disableCampoform(this.tablaForm,"por_desc");                       
                      } else {
                        this.libmantab.enableCampoform(this.tablaForm,"por_desc");                                               
                      }
                      if (this.regCotizac.inc_iva)
                        this.por_iva = result0.por_iva;
                      else 
                        this.por_iva = 0;
                      

                    } else {
                      //viene el registro con el error
                      this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
                      var regerror = result.messages[0];
                      this.message = regerror.menerror;
                      this.showError(regerror.menerror);
                    }
                  },
                  error => {
                    this.libmantab.asignaValorcampoform(this.tablaForm,"valor_list",0);
                    console.log("Error en getNetsolinObjconParametros");
                    console.log(error);
                    this.showError(error);
                  }
                );

              // this.inicializado = true;
              // this.tabstrip.selectTab(0);
              this.cargorefere = true;
            // }
          } else {
            console.log("llega con error no encontro limpiar");
            // console.log('add producto dejando en blanco nativeElement');
            // console.log(this.txtCodrefven);
            // console.log(this.txtCodrefven.inputbus.nativeElement);
            this.libmantab.asignaValorcampoform(
              this.tablaForm,
              "cod_refven",
              ""
            );
            //asegurarse de que quede vacio
            this.txtCodrefven.inputbus.nativeElement.value = "";
          }
        });
    } else {
      //ad producto
      console.log("add producto dejando en blanco nativeElement");
      // console.log(this.txtCodrefven);
      // console.log(this.txtCodrefven.inputbus.nativeElement);
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_refven", "");
      //asegurarse de que quede vacio
      this.txtCodrefven.inputbus.nativeElement.value = "";
    }
  }

  retornaRutaAcampana() {
    // addregtbasica/VPARCOMPETENCIA
  }


  public close() {
    this.confmodifica = false;
  }

  public open() {
    this.confmodifica = true;
  }

  openconsulta(ptipo) {
    if (ptipo == "refere") {
      this.consultarefere = true;
    } else if (ptipo == "prodfc") {
      this.consultaprodfc = true;
    }
  }
  public closeconsulta(ptipo) {
    if (ptipo == "refere") {
      this.consultarefere = false;
    } else if (ptipo == "prodfc") {
      this.consultaprodfc = false;
    }
  }

  //cambia variable para que abra ventana de busqueda de referencia
  openbusqueda(ptipo) {
    if (ptipo == "refere") {
      var lcontrolcampo: any;
      //leer lo digitato en referencia para que sea valor ini a buscar
      lcontrolcampo = this.tablaForm.controls["cod_refven"];
      this.referebuscar = lcontrolcampo.value;
      this.llamabuscarrefere = true;
    } else if (ptipo == "prodfc") {
      var lcontrolcampo: any;
      //leer lo digitato en referencia para que sea valor ini a buscar
      lcontrolcampo = this.tablaForm.controls["cod_prod"];
      this.prodfcbuscar = lcontrolcampo.value;
      this.llamabuscarprod = true;
    }
  }
  public closebusqueda(valllega, ptipo) {
    if (ptipo == "refere") {
      //asignar el valor retornado a campo cod_refven
      if (typeof valllega != "undefined" && valllega != "") {
        this.libmantab.asignaValorcampoform(
          this.tablaForm,
          "cod_refven",
          valllega
        );
      }
      this.llamabuscarrefere = false;
    } else if (ptipo == "prodfc") {
      if (typeof valllega != "undefined" && valllega != "") {
        this.libmantab.asignaValorcampoform(
          this.tablaForm,
          "cod_prod",
          valllega
        );
      }
      this.llamabuscarprod = false;
    }
  }
  openadicion(ptipo) {
    if (ptipo == "refere") {
      this.crearrefere = true;
    } else if (ptipo == "prodfc") {
      this.crearprodfc = true;
    }
  }
    public closeadicion(ptipo) {
      if (ptipo == "refere") {
        this.crearrefere = false;
      } else if (ptipo == "prodfc") {
        this.crearprodfc = false;
      }
    }
  
    //retorna filtro adecuado de acuerdo con motor para la tabla dada
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




