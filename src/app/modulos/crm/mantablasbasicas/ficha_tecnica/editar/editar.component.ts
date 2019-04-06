
import { Component, VERSION, OnInit,Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { HttpClient } from '@angular/common/http';
import { NetsolinApp } from '../../../../../shared/global';
import { UpperCaseTextDirective } from '../../../../../netsolinlibrerias/directive/upper-case.directive';
import { MantbasicaService } from '../../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../../services/mantbasica.libreria';
import { varGlobales } from '../../../../../shared/varGlobales';
import { NetsolinService } from '../../../../../services/netsolin.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'crm-editfichatec',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditregFichatecComponent implements OnInit {
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
  regProdref: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  inicializado=false;
  listaerrores: any[] = [];
  grabo = false;
  message = "";
  cargando = false;
  resultados = false;
  crearcampana = false;
  crearsectore = false;
  crearorigencp = false;
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
  creartercero = false;
  prod_catalogo = true;
  cargorefere= false;
  labelprodref="";
  llinkimagen="";
  filtroficha="id_fichatec=11";
  crearimagen=false;
  linkimagen="";
  linkcreaimagen="";
  id_fichatec: any;
  filtrofichaarch="";
  usacampomarca = false;
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;

  
  //id_terconsulta: string;
  //id_cliepoten: string;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 
  public paramtabarchivos: any = {titulo: "Archivos",cod_usuar :"",cod_refven:"", ano:this.ano}
  public paramtabarchivosprod: any = {titulo: "Archivos",cod_usuar :"",cod_prod:"", ano:this.ano}
  //campos a visualizar de contactos
  public liscampvconta = [
    { titulo: 'Nombre', campo: 'nombre'},
    { titulo: 'Marca', campo: 'marca' },
    { titulo: 'Catalogo', campo: 'esde_catalogo' },
    { titulo: 'Cod_Venta', campo: 'cod_refven' },
    { titulo: 'Cod_Producto', campo: 'cod_prod' },
    { titulo: 'Frente', campo: 'dime_frente' },
    { titulo: 'Num_Bandejas', campo: 'num_bande' },
    { titulo: 'Capacidad', campo: 'capacidad' },
    { titulo: 'Material', campo: 'mater_fabric' },
    { titulo: 'Potencia', campo: 'potencia' },
    { titulo: 'Corriente', campo: 'corriente' },
    { titulo: 'Frecuencia', campo: 'frecuencia' },
    { titulo: 'Voltaje', campo: 'voltaje' },
    { titulo: 'Breaker', campo: 'break_suge' },
    { titulo: 'Con_Desague', campo: 'conex_desa' },
    { titulo: 'Diam_Desague', campo: 'diame_desa' },
    { titulo: 'Tipo_tube', campo: 'tip_tube' },
    { titulo: 'Alt_Max', campo: 'altu_max' },
    { titulo: 'Campaña', campo: 'camext_for' },
    { titulo: 'Trampa', campo: 'tram_gras' },
    { titulo: 'Capa_Max', campo: 'capa_max' },
    { titulo: 'Capa_Mini', campo: 'capa_mini' },
    { titulo: 'Margen', campo: 'marg_erro' },
    { titulo: 'Division', campo: 'div_escal' },
    { titulo: 'Indicador', campo: 'indicador' },
    { titulo: 'Diam_tube', campo: 'diam_tube' },
    { titulo: 'Potencia_ter', campo: 'poten_ter' },
    { titulo: 'Presion_GN', campo: 'presi_gn' },
    { titulo: 'Presion_GLP', campo: 'presi_glp' },
    { titulo: 'Caudal_GN', campo: 'cauda_gn' },
    { titulo: 'Caudal_GLP', campo: 'cauda_glp' },
    { titulo: 'Agua_Fria', campo: 'agua_fri' },
    { titulo: 'Tipo_conex', campo: 'tip_conex' },
    { titulo: 'Altura_conex', campo: 'alt_conex' },
    { titulo: 'Acce_Inclu', campo: 'acce_incl' },
    { titulo: 'Acce_Adic', campo: 'acce_opci' }
    
];
  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private service: NetsolinService,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    private sanitizer: DomSanitizer
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
        let lvar = '';
        lvar = localStorage.getItem("DDT" + this.ptablab);
        this.camposform = JSON.parse(lvar);
        for (var litemobj of this.camposform) {
          // console.log("litemobj",litemobj);
          if (litemobj.name === 'marca'){
            this.usacampomarca = true;
        } 
          //Crear campo formulario con valor por default
          let lcampformctrl = new FormControl('');
          //adicionar validacion si es obligatorio
          if (litemobj.obliga) {
            lcampformctrl.setValidators([Validators.required])
          };
          this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
        };
        this.tablaForm = this.tablaFormOrig;
        //buscar con cod_refven
        console.log('a buscar con referencia:',this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre);
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {            
            console.log('de bus refe',regTabla);
            if (typeof (regTabla.isCallbackError) != "undefined") {
               //buscar con cod_prod
               console.log('a buscar con producto:',this.id, this.ptablab, this.paplica, 'cod_prod', this.pclase_nbs, this.pclase_val, this.pcamponombre);
               this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, 'cod_prod', this.pclase_nbs, this.pclase_val, this.pcamponombre)
                .subscribe(regTabla => {
                  console.log('de bus prod',regTabla);
                  if (typeof (regTabla.isCallbackError) != "undefined") {
                   
                    this.enlistaerror = true;
                    this.listaerrores = regTabla.messages;
                  } else {
                    this.cargorefere=true;
                    this.regProdref = regTabla;
                    this.prod_catalogo = regTabla.esde_catalogo;
                    var fecha = new Date();
                    var ano = fecha.getFullYear();
                    this.paramtabarchivosprod.cod_usuar = NetsolinApp.oapp.cuserid;
                    this.paramtabarchivosprod.cod_prod = regTabla.cod_prod;
                    this.paramtabarchivosprod.ano = ano;
                    //Traer links para la imagen
                    //NetsolinApp.objenvrest.tiporet= "CON";
                    this.service.getNetsolinObjconParametros("MONTABPRODFCIMAGEN",this.paramtabarchivos)
                    .subscribe(result => {
                        var result0 = result[0];
                        // console.log(result0);
                        if (typeof result.isCallbackError === "undefined") {       
                          //viene con links y datos imagen
                          this.linkimagen = result0.linkimg;                    
                          if (!result0.existe){
                            this.linkcreaimagen=result0.linkcreaimg;
                            this.crearimagen=true;
                          } else {
                            this.linkcreaimagen=result0.linkcreaimg;
                            this.crearimagen=false;                      
                          }
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

                  
                    this.asignaValores(regTabla);
                }
              })
            } else {
              this.cargorefere=true;
              this.regProdref = regTabla;
              console.log('cargo ref regTabla',regTabla);
              this.prod_catalogo = regTabla.esde_catalogo;
              var fecha = new Date();
              var ano = fecha.getFullYear();
              this.paramtabarchivos.cod_usuar = NetsolinApp.oapp.cuserid;
              this.paramtabarchivos.cod_refven = regTabla.cod_refven;
              this.paramtabarchivos.ano = ano;
              //Traer links para la imagen
              //NetsolinApp.objenvrest.tiporet= "CON";
              this.service.getNetsolinObjconParametros("MONTABREFEIMAGEN",this.paramtabarchivos)
              .subscribe(result => {
                console.log('Imagen result:');
                console.log(result);
                  var result0 = result[0];
                  // console.log(result0);
                  if (typeof result.isCallbackError === "undefined") {       
                    //viene con links y datos imagen
                    this.linkimagen = result0.linkimg;                    
                    if (!result0.existe){
                      this.linkcreaimagen=result0.linkcreaimg;
                      this.crearimagen=true;
                    } else {
                      this.linkcreaimagen=result0.linkcreaimg;
                      this.crearimagen=false;                      
                    }
                     
                    // console.log(this.linkimagen);
                    // console.log(this.crearimagen);
                    // console.log(this.linkcreaimagen);
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

              
              this.asignaValores(regTabla);
            }
          })
      });

  }

  asignaValores(preg: any) {
    this.cargando = true;
    this.resultados = false;
    this.filtroficha = "id_fichatec="+preg.id_fichatec;
    this.filtrofichaarch= "id_modasocia="+preg.id_fichatec;
    this.id_fichatec = preg.id_fichatec;
    this.libmantab.asignaValoresform(preg, this.tablaForm, this.camposform, false);
    this.inicializaForm(preg);
  }
  //Inicializar el formulario con validaciones adicionales
  inicializaForm(preg: any) {
   
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    avalida.push(Validators.required);
    this.labelprodref="";
    //por defecto al inicializar el producto es de catalogo obligatorio referencia y no la del cod_prod

    // this.prod_catalogo = true;
    // this.libmantab.asignaValorcampoform(this.tablaForm, "esde_catalogo", true);
    this.libmantab.defineValidaCampo(this.tablaForm, "esde_catalogo", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "descrip", avalida);
    this.inicializado = true;

    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
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

  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
  }

  onSubmit() {
    this.enerror = false;
    this.grabo = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    console.log('a grabar:',this.regTabla);
    if (this.regTabla.cod_prod=="" && this.regTabla.cod_refven==""){
      this.showError("Debe ingresar un código de producto o una referencia");
      this.grabando = false;
      this.grabo = false;
    return;
    }
    console.log('a grabar this');
    console.log(this);
     this.mantbasicaService.putregTabla(this.regTabla,this.id, this.ptablab, this.paplica, 'id_fichatec', this.pclase_nbs, this.pclase_val, this.pcamponombre)
      .subscribe(newpro => {
        this.grabando = false;
        var result0 = newpro[0];
        if (typeof newpro.isCallbackError != "undefined") {
          console.log('error grabando');
          this.grabo = false;
          this.confmodifica = false;
          this.enlistaerror = true;
          this.listaerrores = newpro.messages;
        } else {
          this.grabo = true;
          this.confmodifica = true;
          console.log('grabo por id_fichatec')
          console.log(result0);              
           this.showMensaje("Se modifico registro.");
          // this.router.navigate(['/' + this.rutamant])
        }        
      }, error => {
        console.log('error grabando');
        console.log(error);
        this.grabando = false;
        this.confmodifica = false;
        this.grabo = false;
        this.showError(error);
      })

      // this.mantbasicaService.postregTabla(this.regTabla, this.ptablab, this.paplica, 'cod_prod', this.pclase_nbs, this.pclase_val, this.pcamponombre)
      // .subscribe(newpro => {
      //   this.grabando = false;
      //   var result0 = newpro[0];
      //   // console.log(result0);
        
      
      //     this.grabo = true;
      //     this.confmodifica = true;
      //     this.showMensaje('Se modifico contacto.');
      //     // this.router.navigate(['/' + this.rutamant])
        
      // }, error => {
      //   this.grabando = false;
      //   this.confmodifica = false;
      //   this.grabo = false;
      //   this.showError(error);
      // })

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

  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
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
      this.mantbasicaService
        .getregTabla(lvalor, "REFERE_V", "10", "cod_refven", "", "", "nombre")
        .subscribe(regTabla => {
          if (typeof regTabla.isCallbackError == "undefined") {
            this.regProdref = regTabla;
            this.labelprodref = regTabla.nombre;
            this.cargorefere = true;
            this.llinkimagen = "../referencias/"+regTabla.cod_refven.trim()+".png"; 
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
  refrescaArchivos(regDeta) {
    // console.log('llega refresca refrescaArchivos reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
  }


}
