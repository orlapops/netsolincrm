import { Component, VERSION, OnInit,Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { NetsolinApp } from '../../../../../shared/global';
import { UpperCaseTextDirective } from '../../../../../netsolinlibrerias/directive/upper-case.directive';
import { MantbasicaService } from '../../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../../services/mantbasica.libreria';
import { varGlobales } from '../../../../../shared/varGlobales';
import { NetsolinService } from '../../../../../services/netsolin.service';

@Component({
  selector: 'crm-addfichatec',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.css']
})
export class AddregFichatecComponent implements OnInit {
  @Input() vparcaptura: string;
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
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
  regProdref: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  crearcampana = false;
  crearsectore = false;
  crearorigencp = false;
  prod_catalogo = true;
  cargorefere= false;
  labelprodref="";
  llinkimagen="";
  usacampomarca = false;
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;

  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 
  public paramtabarchivos: any = {titulo: "Archivos",cod_usuar :"",cod_refven:"", ano:this.ano}
  public paramtabarchivosprod: any = {titulo: "Archivos",cod_usuar :"",cod_prod:"", ano:this.ano}

  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private service: NetsolinService,
    private activatedRouter: ActivatedRoute,
    private pf: FormBuilder) {
  }
  ngOnInit() {
    // console.log("ngoninit contactos 1");
    this.activatedRouter.params
      .subscribe(parametros => {
        // console.log("ngoninit contactos 1.1");
        // this.varParam = parametros['varParam'];
        
        if (this.vparcaptura) {
          this.varParam = this.vparcaptura;
        } else {
          this.varParam = parametros['varParam'];
        }
        let lvart: any;
        lvart = localStorage.getItem(this.varParam);
        let lobjpar = JSON.parse(lvart);
        this.title = lobjpar.titulo;
        this.rutamant = lobjpar.rutamant;
        this.vglobal.titulopag ='Adicionar: '+this.title;
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
        // console.log("ngoninit contactos 1.2");
        this.camposform = JSON.parse(lvar);
        for (var litemobj of this.camposform) {
          //  console.log("litemobj",litemobj);
          //Crear campo formulario con valor por default
          let vardefa: any;
          if (litemobj.type == 'text' && litemobj.val_defaul.length != 0) {
            var strvd = litemobj.val_defaul.toUpperCase();
            if (strvd.substring(0, 5) != 'OAPP.' && strvd.substring(0, 9) != 'THISFORM.') {
              vardefa = eval(litemobj.val_defaul);
            } else {
              vardefa = '';
            }
          } else if (litemobj.type == 'checkbox' && litemobj.val_defaul.length != 0) {
            vardefa = litemobj.val_defaul == 'true', true, false;
          }
          if (litemobj.name === 'marca'){
              this.usacampomarca = true;
          } 
          let lcampformctrl = new FormControl(vardefa);
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
          //Se debe deshabilitar si no permite adicionar
          if (!litemobj.per_adicionar) {
            lcampformctrl.disable();
          }
          this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
        };
        // console.log("ngoninit contactos 1.3");
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
  
    this.labelprodref="";
    //por defecto al inicializar el producto es de catalogo obligatorio referencia y no la del cod_prod
    this.prod_catalogo=true;

    avalida.push(Validators.required);
    this.libmantab.asignaValorcampoform(this.tablaForm, "esde_catalogo", true);
    this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
    this.libmantab.asignaValorcampoform(this.tablaForm, "cod_refven", "");
    this.libmantab.defineValidaCampo(this.tablaForm, "esde_catalogo", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "descrip", avalida);

    //this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven",avalida);
    //this.libmantab.defineValidaCampo(this.tablaForm, "cod_prod",avalida);
    this.inicializado = true;
  }
  //Se usa para detectar cambios en un campo especifico ejemplo al validar un campo hacer 
  //que se haga algo adicional. En terceros al validar el tercero dejar este mismo en nit si esta vacio
  onChanges(): void {
    
    this.tablaForm.get("esde_catalogo").valueChanges.subscribe(val => {
      //si cambia check producto de catalogo
      // console.log("onchange prod_catal");
      // console.log(val);
      if (this.grabando)
          return;
      this.message = "";
      this.enerror = false;
      this.labelprodref = "";
      //asignar valor del check a prod catalogo 
      this.prod_catalogo = val;
      var avalida = [];

      avalida.push(Validators.required);

     
      
      return this.onChanges;
    });

  }


  onSubmit() {
    this.enerror = false;
    this.grabo = false;
    this.grabando = true;
    this.enlistaerror = false;
    this.regTabla = this.saveregTabla();
    console.log(this.regTabla);
    if (this.regTabla.cod_prod=="" && this.regTabla.cod_refven==""){
      this.showError("Debe ingresar un código de producto o una referencia");
      this.grabando = false;
      this.grabo = false;
    return 
    }
    if (this.regTabla.esde_catalogo){
    console.log('a adicionar',this.regTabla, this.ptablab, this.paplica, 'cod_refven', this.pclase_nbs, this.pclase_val, this.pcamponombre);
    this.mantbasicaService.postregTabla(this.regTabla, this.ptablab, this.paplica, 'cod_refven', this.pclase_nbs, this.pclase_val, this.pcamponombre)
      .subscribe(newpro => {
        this.grabando = false;
        var result0 = newpro[0];
        if (typeof (newpro.isCallbackError) != "undefined") {
          this.grabo = false;
          console.error(newpro.messages);
          this.showError(newpro.messages[0].menerror);  
        } else {
          console.log('resul graba reg',result0,newpro);    
          this.grabo = true;
          this.tablaForm.reset();
          this.showMensaje('Se adiciono producto.');
        }
      }, error => {
        this.grabando = false;
        this.grabo = false;
        console.error(error);
        this.showError(error);
      })
    } else {
      console.log('a adicionar',this.regTabla, this.ptablab, this.paplica, 'cod_prod', this.pclase_nbs, this.pclase_val, this.pcamponombre);
      this.mantbasicaService.postregTabla(this.regTabla, this.ptablab, this.paplica, 'cod_prod', this.pclase_nbs, this.pclase_val, this.pcamponombre)
      .subscribe(newpro => {
        this.grabando = false;
        var result0 = newpro[0];
        if (typeof (newpro.isCallbackError) != "undefined") {
          this.grabo = false;
          console.error(newpro.messages);
          this.showError(newpro.messages[0].menerror);  
        } else {
          console.log('resul graba reg',result0,newpro);    
          this.grabo = true;
          this.tablaForm.reset();
          this.showMensaje('Se adiciono producto.');
        }
      }, error => {
        this.grabando = false;
        this.grabo = false;
        console.error(error);
        this.showError(error);
      });
       // .subscribe(newpro => {
      //   console.log('resul graba reg',result0,newpro);    
      //   this.grabando = false;
      //   var result0 = newpro[0];
        
      //     this.grabo = true;
      //     this.tablaForm.reset();
      //     this.showMensaje('Se adiciono producto.');
        
      // }, error => {
      //   this.grabando = false;
      //   this.grabo = false;
      //   console.error(error);
      //   this.showError(error);
      // })
    }
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

  verCombocod_refven(event, pcamporecibe, pcamporetorna) {
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
    //traer referencia
    this.cargorefere = false;
    this.labelprodref = "";
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService.getregTabla(lvalor, "REFERE_V", "10", "cod_refven", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof regTabla.isCallbackError == "undefined") {
            this.regProdref = regTabla;
            this.labelprodref = regTabla.nombre;
            this.cargorefere = true;
            this.llinkimagen = "../referencias/"+regTabla.cod_refven.trim()+".png"; 
            this.cargorefere = true;
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"nombre",regTabla.nombre);
            var fecha = new Date();
            var ano = fecha.getFullYear();          
            this.paramtabarchivos.cod_usuar = NetsolinApp.oapp.cuserid;
            this.paramtabarchivos.cod_refven = regTabla.cod_refven;
            this.paramtabarchivos.ano = ano;
            //Traer links para la imagen
            //NetsolinApp.objenvrest.tiporet= "CON";
            this.service.getNetsolinObjconParametros("MONTABREFEIMAGEN",this.paramtabarchivos)
            .subscribe(result => {
                var result0 = result[0];
                if (typeof result.isCallbackError === "undefined") {       
                  //viene con links y datos imagen
                  this.llinkimagen = result0.linkimg;                    
                } else {
                  //viene el registro con el error
                  console.log("Error en ejecutaObjeto 1");
                  console.log(result);
                }
              },
              error => {
                console.log("Error en ejecutaObjeto2 ");
                console.log(error);
              }
            );          
          } else {
            console.log("llega con error no encontro limpiar");
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_refven","");
          }
        });
    } else {
      //ad producto
      console.log("add producto dejando en blanco nativeElement");
      // console.log(this.txtCodrefven);
      // console.log(this.txtCodrefven.inputbus.nativeElement);
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_refven", "");
    }
    
  }

  verCombocod_prod(event, pcamporecibe, pcamporetorna) {
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
    //traer referencia
    this.cargorefere = false;
    this.labelprodref = "";
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService
        .getregTabla(lvalor, "PRODUCTOS", "21", "cod_prod", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof regTabla.isCallbackError == "undefined") {
            this.regProdref = regTabla;
            this.labelprodref = regTabla.nombre;
            this.llinkimagen = "../referencias/"+regTabla.cod_prod.trim()+".png"; 
            this.cargorefere = true;
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"nombre",regTabla.nombre);
            var fecha = new Date();
            var ano = fecha.getFullYear();          
            this.paramtabarchivosprod.cod_usuar = NetsolinApp.oapp.cuserid;
            this.paramtabarchivosprod.cod_refven = regTabla.cod_refven;
            this.paramtabarchivosprod.ano = ano;
            //Traer links para la imagen
            //NetsolinApp.objenvrest.tiporet= "CON";
            this.service.getNetsolinObjconParametros("MONTABPRODFCIMAGEN",this.paramtabarchivos)
            .subscribe(result => {
                var result0 = result[0];
                if (typeof result.isCallbackError === "undefined") {       
                  //viene con links y datos imagen
                  this.llinkimagen = result0.linkimg;                    
                } else {
                  //viene el registro con el error
                  console.log("Error en ejecutaObjeto 1");
                  console.log(result);
                }
              },
              error => {
                console.log("Error en ejecutaObjeto2 ");
                console.log(error);
              }
            );          
          } else {
            console.log("llega con error no encontro limpiar");
            this.libmantab.asignaValorcampoform(this.tablaForm,"cod_prod","");
          }
        });
    } else {
      //ad producto
      console.log("add producto dejando en blanco nativeElement");
      // console.log(this.txtCodrefven);
      // console.log(this.txtCodrefven.inputbus.nativeElement);
      this.libmantab.asignaValorcampoform(this.tablaForm, "cod_prod", "");
    }

  }


}
