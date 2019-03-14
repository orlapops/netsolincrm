
import { Component, VERSION, OnInit,Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { HttpClient } from '@angular/common/http';
import { NetsolinApp } from '../../../../shared/global';
import { UpperCaseTextDirective } from '../../../../netsolinlibrerias/directive/upper-case.directive';
import { MantbasicaService } from '../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../services/mantbasica.libreria';
import { varGlobales } from '../../../../shared/varGlobales';
import { NetsolinService } from '../../../../services/netsolin.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tienda-editproductos',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditregProductosComponent implements OnInit {
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

  base64textString: string;
  base64textString2: string;
  base64textString3: string;

  imagrandeUrl: any;
  imapequenaUrl: any;
  imadicionalUrl: any;

  fileToUpload:  File=null;
  fileToUpload2: File=null;
  fileToUpload3: File=null;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false;   

  public liscampvcategor = [
    { titulo: 'Nombre_corto', campo: 'nombre_corto' },
    { titulo: 'Descripción', campo: 'descripcion' },
    { titulo: 'Icono', campo: 'icono' },
    { titulo: 'Cod_Venta', campo: 'cod_refven' },
    { titulo: 'Inactivo', campo: 'inactivo' },
    { titulo: 'Precio', campo: 'precio' },
    { titulo: 'Id_Subcategoria', campo: 'id_subcatego' },
    { titulo: 'Imagen grande', campo: 'imagen_grande' },
    { titulo: 'Imagen pequeña', campo: 'imagen_pequena' },
    { titulo: 'Imagen adicional', campo: 'imagen_adicional' }

  ];
  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    private domSanitizer: DomSanitizer
  
  )
    
    {
  }
  ngOnInit() {
    // console.log("en ngOnInit editregcontactocial");
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
        
        let lvar = "";
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
          var acllave = lobjpar.campollave.split(",");
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

    
    //Imagen grande
    this.imagrandeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.tablaForm.value.imagen_grande);

    //Imagen pequeña
    this.imapequenaUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.tablaForm.value.imagen_pequena);

      //Imagen adicional
      this.imadicionalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
      + this.tablaForm.value.imagen_adicional);
  }

  //Inicializar el formulario con valores por defecto adicionales a los que vienen del diccionario
  inicializaForm(preg: any) {
    console.log('ini form contactos preg');
    console.log(preg);

    var avalida = [];
    //por defecto al inicializar el id para se reconocido en Sql
    avalida.push(Validators.required);
    this.libmantab.defineValidaCampo(this.tablaForm, "nombre_corto", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_refven", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "id_subcatego", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "icono", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "precio", avalida);
    
    this.cargando = false;
    this.resultados = true;
  }
  //Se usa para detectar cambios en un campo especifico ejemplo al validar un campo hacer 
  //que se haga algo adicional. En terceros al validar el tercero dejar este mismo en nit si esta vacio
 
  onChanges(): void {
   
  }


  onSubmit() {

    this.enerror = false;
    this.grabo = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    
       //EDITAR BASE64 A SQL
       this.regTabla.imagen_grande=this.base64textString; //IMAGEN GRANDE
       this.regTabla.imagen_pequena=this.base64textString2; //IMAGEN PEQUEÑA
       this.regTabla.imagen_adicional=this.base64textString3; //IMAGEN ADICIONAL
   
       console.log("Editar Base 64 grande");
       console.log(this.regTabla.imagen_grande);
   
       console.log("Editar Base 64 pequeña");
       console.log(this.regTabla.imagen_pequena);
     
       console.log("Editar Base 64 adicional");
       console.log(this.regTabla.imagen_adicional);

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
          this.showMensaje('Se modificaron las categorias.');
          // this.router.navigate(['/' + this.rutamant])
        }
      }, error => {
        this.grabando = false;
        this.confmodifica = false;
        this.grabo = false;
        this.showError(error);
      })

  }

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
  public close() {
    this.confmodifica = false;
  }

  public open() {
    this.confmodifica = true;
  }



  

}
