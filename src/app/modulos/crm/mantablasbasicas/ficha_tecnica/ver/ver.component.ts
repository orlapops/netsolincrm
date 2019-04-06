
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
  selector: 'crm-vertfichatec',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerregFichatecComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vtipoficha: string;  
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
  regProdref: any;
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
  prod_catalogo = true;
  cargorefere= false;
  labelprodref="";
  linkimagen="";
  filtroficha="id_fichatec=11";
  filtrofichaarch="";
  id_fichatec: any;
  crearimagen=false;
  linkcreaimagen="";
  usacampomarca = false;
  fechahoy = new Date();
  ano = this.fechahoy.getFullYear();
  mes = this.fechahoy.getMonth() + 1;

  public paramtabarchivosprod: any = {titulo: "Archivos",cod_usuar :"",cod_prod:"", ano:this.ano}
  public paramtabarchivos: any = {titulo: "Archivos",cod_usuar :"",cod_refven:"", ano:this.ano}

  //campos a visualizar de ficha tec
  public liscampvconta = [
    { titulo: 'Catalogo', campo: 'esde_catalogo' },
    { titulo: 'Cod_Venta', campo: 'cod_refven' },
    { titulo: 'Cod_Producto', campo: 'cod_prod' },
    { titulo: 'Nombre', campo: 'nombre' },
    { titulo: 'Marca', campo: 'marca' },
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
    console.log('ver ficha tec');
    this.activatedRouter.params
      .subscribe(parametros => {
        console.log('ver ficha tec 1');
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
        //buscar con cod_refven
         //Espacial ver para consultar ficha desde monitor ref o producto
        console.log('vtipoficha en ver ficha');
        console.log(this.vtipoficha);
       if (this.vtipoficha=='R'){
            this.pcampollave = 'cod_refven';
        } 
        console.log('this.pcampollave');
        console.log(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre);
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
            console.log('regTabla',regTabla);
            if (typeof (regTabla.isCallbackError) != "undefined") {
               //buscar con cod_prod
              this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, 'cod_prod', this.pclase_nbs, this.pclase_val, this.pcamponombre)
                .subscribe(regTabla => {
                  console.log('regTabla',regTabla);
                  if (typeof (regTabla.isCallbackError) != "undefined") {
                    this.consulto = false;
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

                    this.consulto = true;
                    this.asignaValores(regTabla);
                }
              })
            } else {
              this.cargorefere=true;
              this.regProdref = regTabla;
              if (typeof regTabla.marca  === "undefined"){
                this.usacampomarca = false;                
              } else {
                this.usacampomarca = true;                                
              }

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

              this.consulto = true;
              this.asignaValores(regTabla);
            }
          })
      });

  }

  asignaValores(preg: any) {
    this.cargando = true;
    this.resultados = false;
    this.filtrofichaarch= "id_modasocia="+preg.id_fichatec;
    this.filtroficha = "id_fichatec="+preg.id_fichatec;
    this.id_fichatec = preg.id_fichatec;
    this.libmantab.asignaValoresform(preg, this.tablaForm, this.camposform, true);
    this.inicializaForm();
  }

  //Inicializar el formulario con validaciones adicionales
  inicializaForm() {
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
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
  }
  refrescaArchivos(regDeta) {
    // console.log('llega refresca refrescaArchivos reg');
    // console.log(regDeta);
    // console.log(regDeta.regdeta);
  }

  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
  }
  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }
  generar_pdf(){
    console.log('a generar pdf de ficha tecnica');
  }  
}
