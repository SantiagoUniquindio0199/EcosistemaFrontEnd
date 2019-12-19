import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';
import {EntidadService} from '../services/entidad.service';
import {StartupService} from '../services/startup.service';

@Injectable()
export class AuthStartupEntidadGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate() {
        const rol = localStorage.getItem('usuarioSesion');
        if (rol === 'startup' || rol === 'entidad') {
            return true;
        } else {
            swal('Lo sentimos!', 'No tienes permiso para entrar aqui', 'error');
            this.router.navigateByUrl('');
            return false;
        }
    }
}
