import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {StartupService} from '../services/startup.service';
import swal from "sweetalert2";
import {EntidadService} from '../services/entidad.service';
import {AdmService} from '../services/adm.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {}; /**Datos de logeo**/
    tipoEmpresa = null; /**Tipo de empresa que se va a ingresar**/
    titulo = null; /**Titulo que va a llevar la vista segun el usuario**/
    tipo = null; /**Url a la que se redigira el usuario segun el usuario**/
    reg = null; /**Variable que permite que aparezca el boton registrar**/
    loading = false;
    /**
     * Metodo constructor, identifica el tipo de usuario que quiere ingresar
     * @param {Router} router perimite redirigiise a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {StartupService} startupService servicios de startup
     * @param {EntidadService} entidadService servicios de entidad
     * @param {AdmService} admService servicios de admin
     */
    constructor(private router: Router, private startupService: StartupService, private routerUrl: ActivatedRoute,
                private entidadService: EntidadService, private admService: AdmService) {
        this.tipoEmpresa =  this.routerUrl.snapshot.params['tipoEmpresa'];
    }

    /**
     * Modifica la variable del titulo y la de la url
     */
    ngOnInit() {
        if (this.tipoEmpresa === 'startup') {
            this.titulo = 'Nombre de tu Startup';
            localStorage.setItem('ver', 'false');
            this.tipo = '../../startup/new';
            this.reg = true;
        }if (this.tipoEmpresa === 'entidad') {
            this.titulo = 'Nombre de tu Entidad';
            localStorage.setItem('verE', 'false');
            this.tipo = '../../entidad/new';
            this.reg = true;
        }if (this.tipoEmpresa === 'adm') {
            this.titulo = 'Correo del administrador';
            this.tipo = '../../principalAdm';
            this.reg = false;
        }
    }

    /**
     * Redirecciona a la vista de registro dependiendo del tipo
     * de usuario que quiera ingresar
     */
    registro() {
        if (this.tipoEmpresa === 'startup') {
            localStorage.setItem('permisoRegistro', 'true');
            this.router.navigateByUrl('startup/new');
        }if (this.tipoEmpresa === 'entidad') {
            localStorage.setItem('permisoRegistro', 'true');
            this.router.navigateByUrl('entidad/new');
        }
    }

    /**
     * Verfica si los datos ingresados corresponde con el usuario en la base de datos
     */
    login() {
        if (typeof this.model.pass === 'undefined' || typeof this.model.nombre === 'undefined'
            || this.model.nombre === '' || this.model.pass === '') {
            swal( 'ERROR', 'El correo o contraseña no fue ingresado', 'error');
        } else {
            this.loading = true;
            if (this.tipoEmpresa === 'startup')  {
                this.startupService.getStartupByNom(this.model.nombre)
                    .subscribe(res => {
                        if (res.startup !== null) {
                            if (res.startup.contrasena === this.model.pass) {
                                localStorage.setItem('nombre', res.startup.nombre);
                                localStorage.setItem('usuarioSesion', 'startup');
                                this.router.navigateByUrl('principalStartup/startup');
                                this.loading = false;
                            } else {
                                swal( 'ERROR', 'La contraseña es incorrecta', 'error');
                                this.loading = false;
                            }
                        } else {
                            swal( 'ERROR', 'La startup no se encuentra registrada', 'error');
                            this.loading = false;
                        }
                    }, error => {
                        console.log('ERROR');
                        console.log(error);
                    });
            }if (this.tipoEmpresa === 'entidad')  {
                this.entidadService.getEntidadByNom(this.model.nombre)
                    .subscribe(res => {
                        if (res.entidad !== null) {
                            if (res.entidad.contrasena === this.model.pass) {
                                localStorage.setItem('nombreE', res.entidad.nombre);
                                localStorage.setItem('usuarioSesion', 'entidad');
                                this.router.navigateByUrl('principalEntidad/entidad');
                                this.loading = false;
                            } else {
                                swal( 'ERROR', 'La contraseña es incorrecta', 'error');
                                this.loading = false;
                            }
                        } else {
                            swal( 'ERROR', 'La entidad no se encuentra registrada', 'error');
                            this.loading = false;
                        }
                    }, error => {
                        console.log('ERROR');
                        console.log(error);
                    });
            }if (this.tipoEmpresa === 'adm') {
                this.admService.getAdmByCorreo(this.model.nombre)
                    .subscribe(res => {
                        if (res.adm !== null) {
                            if (res.adm.con === this.model.pass) {
                                localStorage.setItem('correo', res.adm.cor);
                                localStorage.setItem('usuarioSesion', 'administrador');
                                this.router.navigateByUrl('infoStartup/adm');
                                this.loading = false;
                            } else {
                                swal( 'ERROR', 'La contraseña es incorrecta', 'error');
                                this.loading = false;
                            }
                        } else {
                            swal( 'ERROR', 'El administrador no se encuentra registrado', 'error');
                            this.loading = false;
                        }
                    });
            }
        }
    }
}
