import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { AppComponent } from './app.component';
import { StartupComponent } from './startup/startup.component';
import {StartupService} from './services/startup.service';
import {ProductoService} from './services/producto.service';
import {HttpClientModule} from '@angular/common/http';
import { DisableControlDirectiveDirective } from './directives/disable-control-directive.directive';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrincipalStartupComponent } from './principal-startup/principal-startup.component';
import { ProductoStartupComponent } from './producto-startup/producto-startup.component';
import { InfoProductoComponent } from './info-producto/info-producto.component';
import { LoginComponent } from './login/login.component';
import { EntidadComponent } from './entidad/entidad.component';
import {EntidadService} from './services/entidad.service';
import { PrincipalEntidadComponent } from './principal-entidad/principal-entidad.component';
import { InfoConvocatoriaComponent } from './info-convocatoria/info-convocatoria.component';
import { ConvocatoriaEntidadComponent } from './convocatoria-entidad/convocatoria-entidad.component';
import { InfoStartupComponent } from './info-startup/info-startup.component';
import {AdmService} from './services/adm.service';
import { InfoEntidadComponent } from './info-entidad/info-entidad.component';
import {ConvocatoriaService} from './services/convocatoria.service';
import {RequisitoService} from './services/requisito.service';
import {ConvocatoriaStartupService} from './services/convocatoria-startup.service';
import {AuthAdminStartupGuard} from './guards/auth-admin-startup.guard';
import {AuthAdminEntidadGuard} from './guards/auth-admin-entidad.guard';
import {AuthStartupEntidadGuard} from './guards/auth-startup-entidad.guard';
import {AuthAdmStartupEntidadGuard} from './guards/auth-adm-startup-entidad.guard';

const appRouters: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'login/:tipoEmpresa', component: LoginComponent},
    {path: 'startup/:nombre', component: StartupComponent, canActivate: [AuthAdminStartupGuard]},
    {path: 'productosStartup/:nombreProd', component: ProductoStartupComponent, canActivate: [AuthAdminStartupGuard]},
    {path: 'entidad/:nombreE', component: EntidadComponent, canActivate: [AuthAdminEntidadGuard]},
    {path: 'convocatoriasEntidad/:nombreConv', component: ConvocatoriaEntidadComponent, canActivate: [AuthAdmStartupEntidadGuard]},
    {path: 'principalStartup/:emisorPS', component: PrincipalStartupComponent, canActivate: [AuthStartupEntidadGuard]},
    {path: 'principalEntidad/:emisorPE', component: PrincipalEntidadComponent, canActivate: [AuthStartupEntidadGuard]},
    {path: 'infoStartup/:emisor', component: InfoStartupComponent, canActivate: [AuthAdminEntidadGuard]},
    {path: 'infoProductos/:emisorP', component: InfoProductoComponent, canActivate: [AuthAdminStartupGuard]},
    {path: 'infoEntidad/:emisorE', component: InfoEntidadComponent, canActivate: [AuthAdminStartupGuard]},
    {path: 'infoConvocatorias/:emisorC', component: InfoConvocatoriaComponent, canActivate: [AuthAdminEntidadGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    StartupComponent,
      DisableControlDirectiveDirective,
      LandingPageComponent,
      PrincipalStartupComponent,
      ProductoStartupComponent,
      InfoProductoComponent,
      LoginComponent,
      EntidadComponent,
      PrincipalEntidadComponent,
      InfoConvocatoriaComponent,
      ConvocatoriaEntidadComponent,
      InfoStartupComponent,
      InfoEntidadComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule.forRoot(appRouters),
      NgxLoadingModule.forRoot({})
  ],
  providers: [StartupService, ProductoService, EntidadService, AdmService, ConvocatoriaService, RequisitoService,
      ConvocatoriaStartupService, AuthAdminStartupGuard, AuthAdminEntidadGuard, AuthStartupEntidadGuard, AuthAdmStartupEntidadGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
