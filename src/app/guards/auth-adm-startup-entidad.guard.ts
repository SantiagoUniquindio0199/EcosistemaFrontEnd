import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import swal from "sweetalert2";

@Injectable()
export class AuthAdmStartupEntidadGuard implements CanActivate {
  constructor(private router: Router) {}
    canActivate() {
        const rol = localStorage.getItem('usuarioSesion');
        if (rol === 'entidad' || rol === 'administrador' || rol === 'startup') {
            return true;
        } else {
            swal('Lo sentimos!', 'No tienes permiso para entrar aqui', 'error');
            this.router.navigateByUrl('');
            return false;
        }
    }
}
