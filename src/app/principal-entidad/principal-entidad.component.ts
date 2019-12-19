import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConvocatoriaService} from '../services/convocatoria.service';
import {EntidadService} from '../services/entidad.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-principal-entidad',
  templateUrl: './principal-entidad.component.html',
  styleUrls: ['./principal-entidad.component.css']
})
export class PrincipalEntidadComponent implements OnInit {

    nombre = null; /**Nombre de la startup que ingreso al sistema**/
    nombreE = null; /**Nombre de la entidad en el sistema**/
    emisorPE = null; /**Usuario que llama la vista**/
    desabilitarMenu = false; /**Variable que indica si se debe desabilitar el menu de la entidad**/
    convocatorias = []; /**Lista de convocatorias que la entidad a creado**/
    loading = false;
    /**
     * Metodo constructor, carga las convocatorias de la entidad
     * @param {Router} router perimite redirigirse a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {ConvocatoriaService} convocatoriaService servicios de convocatoria
     * @param {EntidadService} entidadService servicios de entidad
     */
    constructor(private router: Router, private routerUrl: ActivatedRoute, private convocatoriaService: ConvocatoriaService,
                private entidadService: EntidadService) {
        this.loading = true;
        this.emisorPE = this.routerUrl.snapshot.params['emisorPE'];
        this.nombre = localStorage.getItem('nombre');
        this.nombreE = localStorage.getItem('nombreE');
        if (this.emisorPE === 'startup') {
            this.desabilitarMenu = true;
        }if (this.emisorPE === 'entidad') {
            this.desabilitarMenu = false;
        }
        entidadService.getEntidadByNom(this.nombreE).subscribe(ent => {
            this.convocatoriaService.getConvocatoriaByEntidad(ent.entidad.id).subscribe(c => {
                if (c.convocatorias !== null) {
                    this.convocatorias = c.convocatorias;
                }
            });
            this.loading = false;
        }, error2 => {
            console.log(error2);
            this.loading = false;
        });
    }

  ngOnInit() {
  }
  /**
   * Redirecciona a la pagina para modificar los datos del perfil
   */
  editarInfo() {
      localStorage.setItem('ver', 'false');
      this.router.navigateByUrl('startup/' + this.nombre);
  }
  /**
   * Redirecciona a la pagina para crear un producto
   */
  editarInfoP() {
      localStorage.setItem('verP', 'false');
      this.router.navigateByUrl('productosStartup/new');
  }
  /**
   * Redirecciona a la vista para actualizar los datos de la entidad
   */
  editarInfoE() {
      localStorage.setItem('verE', 'false');
      this.router.navigateByUrl('entidad/' + this.nombreE);
  }
  /**
   * Redirecciona a ala vista para crea una convocatoria
   */
  editarInfoC() {
      localStorage.setItem('verC', 'false');
      this.router.navigateByUrl('convocatoriasEntidad/new');
  }
    /**
     * Evento del boton Cerrar Sesion
     * Termina la sesion del usuario
     */
    cerrarSesion() {
        localStorage.setItem('usuarioSesion', '');
        localStorage.setItem('nombre', '');
        localStorage.setItem('nombreE', '');
        localStorage.setItem('correo', '');
        this.router.navigateByUrl('');
    }
}
