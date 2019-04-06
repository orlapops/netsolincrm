import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { catchError, map, tap } from 'rxjs/operators';
import { NetsolinApp } from '../shared/global';
import { environment } from '../../environments/environment';

@Injectable()
export class NetsolinService {
	constructor(private http: HttpClient) {
	}
	getNetsolinArchIni() {
	}
	getNetsolinhtmlbase(): Observable<any> {
		// return this.http.get(this.baseUrl+'todo2s.csvc').map(res => res.json());
		// console.log('a netsolinbase traer');
		// console.log('netsolinbase urlNetsolin NetsolinApp: '+NetsolinApp.urlNetsolin);
		var paramSolicitud: string="";

		if (environment.production) {
			paramSolicitud=NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc?VRprod=ENPROD";
		} else {
			paramSolicitud=NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc?VRprod=NOPROD";
		}
		
		// return this.http.get(NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc")
		return this.http.get(paramSolicitud)
			.pipe(
			map(resul => {
				return resul;
			})
			);

	}

	private handleError(error: HttpErrorResponse) {
		// console.error('Error en servidor:', error);
		if (error.error instanceof Error) {
			let errMessage = error.error.message;
			return Observable.throw(errMessage);
			// Use the following instead if using lite-server
			//return Observable.throw(err.text() || 'backend server error');
		}
		return Observable.throw(error || 'Node.js server error');
	}

	getNetsolinslide(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=MTB")
			.pipe(
			map(resul => {
				// console.log('map get');
				//  console.log(resul);
				return resul;
			}),
			catchError(this.handleError)
			);
	}


	getNetsolinMonitores(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=CRMI")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMonitores');
				//  console.log(resul);
				return resul;
			})
			);
	}

	getNetsolinMantbas(ptipo, pmodulo): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=" + ptipo + "&VRModulo=" + pmodulo)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMantbas');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinAlertas(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=ALERT")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinAlertas');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinUsuar(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=USUAR")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinAlertas');
				//  console.log(resul);
				return resul;
			})
			);
	}

	getNetsolinRecordatorio(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SEG")
			.pipe(
			map(resul => {
				return resul;
			})
			);
	}

	getNetsolinProcesos(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=PROC")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinProcesos');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinSolicitudes(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SOLI")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinSolicitudes');
				//  console.log(resul);
				return resul;
			})
			);
	}


	getNetsolinMessages(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=MENS")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMessages');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinSolic(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SOLI")
			.pipe(
			map(resul => {
				return resul;
			})
			);
	}
	/**************************************************/
	getNetsolinDictabla(ptabla, paplica, pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = ptabla;
		NetsolinApp.objenvrestddtabla.aplica = paplica;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		// console.log('getNetsolinDictabla ant enviar ');	
		// console.log(NetsolinApp.objenvrestddtabla);
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTCONDDCAMTAB", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('getNetsolinDictabla resaulta');
				// console.log(resul);
				return resul;
			})
			);
	}
	//seguridad objeto en netsolin 
	getNetsolinSegObj(pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTCONSEGOBJ", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinSegObj');
				//  console.log(resul);
				//  console.log(resul[0]);
				return resul[0];
				// return resul;
			})
			);
	}
	//Lee objeto para mant tabla basica
	getNetsolinObjmantbasica(pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTOBJMANTBASICA", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjmantbasica');
				//  console.log(resul);
				return resul;
				//  return resul[0]; 
				// return resul;
			})
			);
	}



	//Verifica si variable VPAR... que se usa como parametros en localsotrage este creada si no la crea
	//ejemplo para llamado en monitores sin que tengan que ingresar primero a la tabla basica
	verificaVpar(pobjeto,pvarParam): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTOBJMANTBASICA", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(result => {
				// console.log('map getNetsolinObjmantbasica');
				//  console.log(resul);
				var result0 = result[0];
				console.log(result0);
				// if (typeof (result.isCallbackError) != "undefined") {
				// 	var  orespuesta: any = {respuesta: "Error"};
				// 	return orespuesta;
				// }

				NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
				NetsolinApp.objpartablabas.tabla = result0.tabla;
				NetsolinApp.objpartablabas.campollave = result0.campollave;
				NetsolinApp.objpartablabas.clase_val = result0.clase_val;
				NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;        
				NetsolinApp.objpartablabas.camponombre = result0.camponombre;
				NetsolinApp.objpartablabas.titulo = result0.title;
				NetsolinApp.objpartablabas.subtitulo = "";
				NetsolinApp.objpartablabas.objeto = pobjeto;
				NetsolinApp.objpartablabas.rutamant = "mantbasica/" + pobjeto;
				NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
				if (result0.campos_lista.length>2){
				  let var3 = JSON.parse(result0.campos_lista);
				  if (typeof(var3)=='object'){
					NetsolinApp.objpartablabas.campos_lista = var3;
				  } else {
						NetsolinApp.objpartablabas.campos_lista = [];
					}
				} 
				let var1 = JSON.stringify(NetsolinApp.objpartablabas);
				localStorage.setItem("VPAR" + result0.tabla, var1);		

				return result;
				//  return resul[0]; 
				// return resul;
			})
			);
	}

	verificaVparMal(pobjeto,pvarParam) : Observable<any> {
		let lvart: any;
        lvart = localStorage.getItem(pvarParam);
        if (lvart) {
		  // console.log('Existe');
			var  orespuesta: any = {respuesta: "Existe"};
		  	return orespuesta;
        } 
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		this.getNetsolinObjmantbasica(pobjeto)
		.subscribe(result =>{
				var result0 = result[0];
				console.log(result0);
				if (typeof (result.isCallbackError) != "undefined") {
					var  orespuesta: any = {respuesta: "Error"};
					return orespuesta;
				}
				NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
				NetsolinApp.objpartablabas.tabla = result0.tabla;
				NetsolinApp.objpartablabas.campollave = result0.campollave;
				NetsolinApp.objpartablabas.clase_val = result0.clase_val;
				NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;        
				NetsolinApp.objpartablabas.camponombre = result0.camponombre;
				NetsolinApp.objpartablabas.titulo = result0.title;
				NetsolinApp.objpartablabas.subtitulo = "";
				NetsolinApp.objpartablabas.objeto = pobjeto;
				NetsolinApp.objpartablabas.rutamant = "mantbasica/" + pobjeto;
				NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
				if (result0.campos_lista.length>2){
				  let var3 = JSON.parse(result0.campos_lista);
				  if (typeof(var3)=='object'){
					NetsolinApp.objpartablabas.campos_lista = var3;
				  } else {
						NetsolinApp.objpartablabas.campos_lista = [];
					}
				} 
				let var1 = JSON.stringify(NetsolinApp.objpartablabas);
				localStorage.setItem("VPAR" + result0.tabla, var1);		
				var  orespuesta: any = {respuesta: "Creado"};
				return orespuesta;
			});
	}

	//llama busqueda por objeto envia objeto objenvrest
	getNetsolinObjbusqueda(pobjeto,pcadbus,pfiltroadi): Observable<any> {
		// console.log('getNetsolinObjbusqueda pobjeto:'+pobjeto+' pcadbus:'+pcadbus+' pfiltroadi: '+pfiltroadi);
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestsolcomobog.tabla = "GENERAL";
		NetsolinApp.objenvrestsolcomobog.aplica = 0;
		NetsolinApp.objenvrestsolcomobog.filtro = pcadbus;
		NetsolinApp.objenvrestsolcomobog.filtroadi = pfiltroadi;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj="+pobjeto, NetsolinApp.objenvrestsolcomobog)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjbusqueda');
				//  console.log(resul);
				 var result0 = resul[0];
				//  console.log(result0);
				 //si hay error retorna lista de errores sino el registro solicitado
				 if (typeof (result0) == "undefined") {
					 return resul;
				 } else {
					 return resul;
				 }
			})
			);
	}
	//Ejecuta servicio rest en Netsolin con un objeto pparam que lleva parametros
	//retorna errores o cursor con resultado
	//Ejemplo de uso para retornar precio d eventa objeto: RESTCONLISTPREC
	///con parametro de llamado: "parametros":{"lista": "V01","cod_refven": "100    ","cod_tercer": "",
	///            "proc_ven": "016 ", "cantidad":10 }
	getNetsolinObjconParametros(pobjeto,pparam:any): Observable<any> {
		// console.log('getNetsolinObjconParametros pobjeto:'+pobjeto);
        NetsolinApp.objenvrest.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrest.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrest.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrest.filtro = "";
		NetsolinApp.objenvrest.parametros = pparam;
		if (NetsolinApp.objenvrest.tiporet != "OBJ")
			NetsolinApp.objenvrest.tiporet= "CON";
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj="+pobjeto, NetsolinApp.objenvrest)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjconParametros');
				//  console.log(resul);
				 var result0 = resul[0];
				//  console.log(result0);
				 //si hay error retorna lista de errores sino el registro solicitado
				 if (typeof (result0) == "undefined") {
					 return resul;
				 } else {
					 return resul;
				 }
			})
			);
	}

}