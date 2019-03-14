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
  selector: 'tienda-verproductos',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerregProductosComponent implements OnInit {
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
  listaerrores: any[ ] = [ ];
  consulto = false;
  camposform: any;
  varParam: string;
  rutamant: string;
  id: string;
  cargando = false;
  resultados = false;

  imagrandeUrl: any;
  imapequenaUrl: any;
  imadicionalUrl: any;
  
  //campos a visualizar de contactos
  public liscampvcategor = [
    { titulo: 'Nombre', campo: 'nombre_corto' },
    { titulo: 'Cod_refven', campo: 'cod_refven' },
    { titulo: 'Id_subcatego', campo: 'id_subcatego' },
    { titulo: 'Descripción', campo: 'descripcion' },
    { titulo: 'Icono', campo: 'icono' },
    { titulo: 'Imagen grande', campo: 'imagen_grande' },
    { titulo: 'Imagen pequeña', campo: 'imagen_pequena' },
    { titulo: 'Imagen adicional', campo: 'imagen_adicional' }

  ];


  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private service: NetsolinService,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    private domSanitizer: DomSanitizer
    
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
        // this.id = parametros['id'];
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
        //Cambiar titulo 
        NetsolinApp.objtitmodulo.titulo = lobjpar.titulo;

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
        this.mantbasicaService.getregTabla(this.id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
          .subscribe(regTabla => {
            if(typeof(regTabla.isCallbackError) != "undefined") {
              this.consulto=false;
              this.enlistaerror = true;
              this.listaerrores = regTabla.messages;
            } else {  
              this.consulto=true;
              this.asignaValores(regTabla);

              

            }   
          })
      });


  }


  
   asignaValores(preg: any) {
    this.cargando = true;
    this.resultados = false;
    this.libmantab.asignaValoresform(preg,this.tablaForm,this.camposform,true);
    this.inicializaForm();

   
    //Imagen grande
    this.imagrandeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.tablaForm.value.imagen_grande);

    //Imagen pequeña
    this.imapequenaUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.tablaForm.value.imagen_pequena);

      //Imagen adiciona
      this.imadicionalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
      + this.tablaForm.value.imagen_adicional);
    
              

  }



  //Inicializar el formulario con validaciones adicionales
  inicializaForm() {
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }


  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
  }




  
}
