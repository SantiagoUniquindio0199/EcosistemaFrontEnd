import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConvocatoriaService} from '../services/convocatoria.service';
import {ConvocatoriaStartupService} from '../services/convocatoria-startup.service';
import {StartupService} from '../services/startup.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-principal-startup',
  templateUrl: './principal-startup.component.html',
  styleUrls: ['./principal-startup.component.css']
})
export class PrincipalStartupComponent implements OnInit {

  startupRegistrada = null; /**Startup que se encuentra registrada en el sistema**/
  nombre = null; /**Nombre de la startup que ingreso al sistema**/
  nombreE = null; /**Nombre de la entidad que ingreso al sistema**/
  emisorPS = null; /**Atributo para conocer si el usuario que accedio a la pagina fue un admin o startup**/
  desabilitarMenu = false; /**Atributo para quitar o mostrar el menu de la startup**/
  convocatorias = []; /**Convocatorias a las que la startup puede aplicar o a las que ya aplico**/
  porcentajeFaltante = []; /**Porcentaje de informacion que falta en cada convocatoria**/
  estadoAplicar = []; /**Estado de las convocatorias, si aplicaron o no**/
  convocatoriaAAplicar = null; /**Convocatoria a la que la startup aplica**/
  loading = false;
    /**
     * Metodo constructor donde se desabilita el menu y se cargan las convocatorias de la startup
     * @param {Router} router perimite redirigiise a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {StartupService} startupService servicios de la startup
     * @param {ConvocatoriaStartupService} convocatoriaStartupService servicios de la relacion de convocatorias y startups
     * @param {ConvocatoriaService} convocatoriaService servicios de la convocatoria
     */
  constructor(private router: Router, private routerUrl: ActivatedRoute, private startupService: StartupService,
              private convocatoriaStartupService: ConvocatoriaStartupService, private convocatoriaService: ConvocatoriaService) {
      this.loading = true;
      this.emisorPS = this.routerUrl.snapshot.params['emisorPS'];
      this.nombre = localStorage.getItem('nombre');
      this.nombreE = localStorage.getItem('nombreE');
      if (this.emisorPS === 'entidad') {
        this.desabilitarMenu = true;
      }if (this.emisorPS === 'startup') {
        this.desabilitarMenu = false;
      }
      this.startupService.getStartupByNom(this.nombre).subscribe(result => {
          this.startupRegistrada = result.startup;
          this.convocatoriaStartupService.getConvocatoria_startupByStartup(this.startupRegistrada.id).subscribe(c => {
              if (c.convocatorias_startup !== null) {
                  c.convocatorias_startup.forEach(elem => {
                      this.convocatorias.push(elem.convocatoriaApli);
                      this.porcentajeFaltante.push(elem.porcentaje);
                      this.estadoAplicar.push(elem.aplico);
                  });
              }
              this.loading = false;
          }, error2 => {
              this.loading = false;
              console.log(error2);
          });
      }, error2 => {
        this.loading = false;
          console.log(error2);
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
   * Redirecciona a la ventana para ver la startup dependiendo del usuario en el sistema
   * @param index startup que se quiere ver
   */
  verInfoConv(index) {
      console.log('entreee');
      localStorage.setItem('verC', 'true');
      localStorage.setItem('entidadC', 'startup');
      localStorage.setItem('startupNom', this.nombre);
      this.router.navigateByUrl('convocatoriasEntidad/' + this.convocatorias[index].nombre);
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

  /**
   * Permite que una aplicacion aplique a una convocatoria
   * @param index de la convocatoria a la que la startup quiere aplicar
   */
  aplicar(index) {
      swal({
          title: '¿Estas seguro?',
          text: '¿Deseas aplicar a esta convocatoria?',
          type: 'info',
          cancelButtonText: 'No',
          confirmButtonText: 'Si',
          confirmButtonColor: '#0072af',
          showCancelButton: true,
          showConfirmButton: true
      }).then(isConfirm => {
          if (isConfirm.value === true) {
              this.convocatoriaStartupService.getConvocatoria_startupByStartupConvocatoria
              (this.startupRegistrada.id, this.convocatorias[index].id).subscribe(r => {
                  this.convocatoriaAAplicar = r.convocatoria_startup.convocatoriaApli;
                  r.convocatoria_startup.aplico = 'true';
                  this.convocatoriaStartupService.saveConvocatoria_startup(r.convocatoria_startup).subscribe(res => {
                      if (res.codigo.toString() === '200') {
                          this.convocatoriaService.getConvocatoriaByNom(this.convocatoriaAAplicar.nombre)
                              .subscribe(resul => {
                                  resul.convocatoria.cantidadAplica ++;
                                  this.convocatoriaService.saveConvocatoria(resul.convocatoria).subscribe(g => {
                                      if (g.codigo.toString() === '200') {
                                          console.log('aplicacion exitosa');
                                      }
                                  }, error2 => {
                                      console.log(error2);
                                  });
                                  this.router.navigateByUrl('principalStartup/startup');
                                  swal('Hecho', 'Has aplicado a esta convocatoria,' +
                                      ' la entidad te estara informando sobre la convocatoria', 'success');
                              }, error2 => {
                                  console.log(error2);
                              });
                          }
                      }, error2 => {
                          console.log(error2);
                      });
                  }, error2 => {
                      console.log(error2);
                  });
          }
      });
  }
}
