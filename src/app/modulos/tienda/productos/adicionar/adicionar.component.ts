import { Component, VERSION, OnInit,Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TabStripComponent } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../../shared/global';
//import { UpperCaseTextDirective } from '../../../../../netsolinlibrerias/directive/upper-case.directive';
import { MantbasicaService } from '../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../services/mantbasica.libreria';
import { varGlobales } from '../../../../shared/varGlobales';
import { NetsolinService } from '../../../../services/netsolin.service';

@Component({
  selector: 'tienda-addproductos',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.css']
})
export class AddregProductosComponent implements OnInit {
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
  labelprodref="";

  base64textString: string;
  base64textString2: string;
  base64textString3: string;

  imagrandeUrl: string= "/assets/img/default.jpeg";
  imapequenaUrl: string= "/assets/img/default.jpeg";
  imadicionalUrl: string= "/assets/img/default.jpeg";

  fileToUpload:  File=null;
  fileToUpload2: File=null;
  fileToUpload3: File=null;

  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false;   

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
          // console.log("ngoninit contactos 1.2.1");
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
    var avalida = [];
    //por defecto al inicializar el id para se reconocido en Sql
    avalida.push(Validators.required);

     this.libmantab.defineValidaCampo(this.tablaForm, "nombre_corto", avalida);
     this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", avalida);
     this.libmantab.defineValidaCampo(this.tablaForm, "id_subcatego", avalida);
     this.libmantab.defineValidaCampo(this.tablaForm, "icono", avalida);
     this.libmantab.defineValidaCampo(this.tablaForm, "precio", avalida);

    this.inicializado = true;
  }
  //Se usa para detectar cambios en un campo especifico ejemplo al validar un campo hacer 
  //que se haga algo adicional. En terceros al validar el tercero dejar este mismo en nit si esta vacio
 
  onChanges(): void {
   
   
  }


  onSubmit() {

    this.enerror = false;
    this.grabo = false;
    this.grabando = true;
    this.enlistaerror = false;
    this.regTabla = this.saveregTabla();
    this.regTabla.id_producto= 999;    

    //AGREGAR BASE64 A SQL
    this.regTabla.imagen_grande=this.base64textString; //IMAGEN GRANDE
    this.regTabla.imagen_pequena=this.base64textString2; //IMAGEN PEQUEÑA
    this.regTabla.imagen_adicional=this.base64textString3; //IMAGEN ADICIONAL

    console.log("Asignar Base 64 grande");
    console.log(this.regTabla.imagen_grande);

    console.log("Asignar Base 64 pequeña");
    console.log(this.regTabla.imagen_pequena);
  
    console.log("Asignar Base 64 adicional");
    console.log(this.regTabla.imagen_adicional);

    console.log(this.regTabla);

    this.mantbasicaService.postregTabla(this.regTabla, this.ptablab, this.paplica,this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
      .subscribe(newpro => {
        this.grabando = false;
        var result0 = newpro[0];
      
    
          this.grabo = true;
          this.tablaForm.reset();
          this.showMensaje('Se adiciono Producto.');
        
      }, error => {
        this.grabando = false;
        this.grabo = false;
        this.showError(error);
      }
    );
  }

  
  //CARGAR IMAGEN GRANDE Y CONVERTIR A BINARIO
  base64Encoding (event) {
    
    var files = event.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

    

  }

  //CARGAR IMAGEN PEQUEÑA Y CONVERTIR A BINARIO
  base64Encoding2 (event) {
    
    var files = event.target.files;
    var file2 = files[0];

    if (files && file2) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded2.bind(this);
      reader.readAsBinaryString(file2);
    }

  }

  //CARGAR IMAGEN ADICIONAL Y CONVERTIR A BINARIO
  base64Encoding3 (event) {
    
    var files = event.target.files;
    var file2 = files[0];

    if (files && file2) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded3.bind(this);
      reader.readAsBinaryString(file2);
    }

  }


  //CONVERTIR IMAGEN GRANDE A BASE 64 
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString= btoa(binaryString);
    this.base64textString2= btoa(binaryString);
 
    console.log("Imagen grande BASE 64"); 
    console.log(btoa(binaryString));
   }

   //CONVERTIR IMAGEN PEQUEÑA A BASE 64 
   _handleReaderLoaded2(readerEvt) {
    var binaryString2 = readerEvt.target.result;
    this.base64textString2= btoa(binaryString2);
 
    console.log("Imagen pequeña BASE 64 "); 
    console.log(btoa(binaryString2));
   }

    //CONVERTIR IMAGEN ADICIONAL A BASE 64 
    _handleReaderLoaded3(readerEvt) {
      var binaryString3 = readerEvt.target.result;
      this.base64textString3= btoa(binaryString3);
   
      console.log("Imagen adicional BASE 64 "); 
      console.log(btoa(binaryString3));
     }


  //MOSTRAR IMAGEN GRANDE
  handleFileInput(file:FileList){

    this.fileToUpload=file.item(0);
    var reader=new FileReader();
    reader.onload=(event:any)=>{
      this.imagrandeUrl= event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);

  }

  //MOSTRAR IMAGEN PEQUEÑA
  handleFileInput2(file:FileList){

    this.fileToUpload2=file.item(0);
    var reader=new FileReader();
    reader.onload=(event:any)=>{
      this.imapequenaUrl= event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload2);

  }

  //MOSTRAR IMAGEN ADICIONAL
  handleFileInput3(file:FileList){

    this.fileToUpload3=file.item(0);
    var reader=new FileReader();
    reader.onload=(event:any)=>{
      this.imadicionalUrl= event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload3);

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
    this.labelprodref = "";
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);
    if (lvalor) {
      this.mantbasicaService.getregTabla(lvalor, "REFERE_V", "10", "cod_refven", "", "", "nombre_corto")
        .subscribe(regTabla => {
          if (typeof regTabla.isCallbackError == "undefined") {
            this.regProdref = regTabla;
            this.labelprodref = regTabla.nombre;
            this.libmantab.asignaValorcampoformsindato(this.tablaForm,"nombre_corto",regTabla.nombre);
            var fecha = new Date();
            var ano = fecha.getFullYear();          
  
            //Traer links para la imagen
            //NetsolinApp.objenvrest.tiporet= "CON";        
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


  verComboid_subcategoria(event, pcamporecibe, pcamporetorna) {
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
   // this.cargorefere = false;
    this.labelprodref = "";
    
    // console.log("verCombocod_tercer ant getregtabla:" + lvalor);

    if (lvalor) {
      this.mantbasicaService.getregTabla(lvalor, "TIEN_SUBCATEG", "31", "id_subcatego", "", "", "")
        .subscribe(regTabla => {
          if (typeof regTabla.isCallbackError == "undefined") {
            this.regProdref = regTabla;
            this.labelprodref = regTabla.nombre;
            //this.libmantab.asignaValorcampoformsindato(this.tablaForm,"nombre_corto",regTabla.nombre_corto);
          } else {
            console.log("llega con error no encontro limpiar");
            this.libmantab.asignaValorcampoform(this.tablaForm,"id_subcatego","");
          }
        });
    } else {
      //ad producto
      console.log("add producto dejando en blanco nativeElement");
      // console.log(this.txtCodrefven);
      // console.log(this.txtCodrefven.inputbus.nativeElement);
      this.libmantab.asignaValorcampoform(this.tablaForm, "id_subcatego", "");
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




  

}
