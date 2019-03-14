import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { APP_ROUTES } from './app.routes';

// Modulos
import { CrmModule } from './modulos/crm/crm.module';
// import { TiendaModule } from './modulos/tienda/tienda.module';


// temporal
import { FormsModule } from '@angular/forms';

// Servicios
import { ServiceModule } from './services/service.module';




// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { varGlobales } from './shared/varGlobales';
// import { GuardService } from './shared/servicios/guard.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    //Modulo principal cambie aqui por el modulo pruncipla la palabra modelo
    CrmModule,
    // TiendaModule,
    FormsModule,
    ServiceModule
  ],
  providers: [
    varGlobales,
    // GuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
