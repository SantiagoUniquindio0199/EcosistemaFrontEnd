import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';
import {EntidadService} from '../services/entidad.service';
import {AdmService} from '../services/adm.service';

@Injectable()
export class AuthAdminEntidadGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate() {
        const rol = localStorage.getItem('usuarioSesion');
        const permisoReg =  localStorage.getItem('permisoRegistro');
        if (permisoReg === 'true') {
            localStorage.setItem('permisoRegistro', '');
            return true;
        }
        if (rol === 'entidad' || rol === 'administrador') {
            return true;
        } else {
            swal('Lo sentimos!', 'No tienes permiso para entrar aqui', 'error');
            this.router.navigateByUrl('');
            return false;
        }
    }
}
