import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StartupService} from '../services/startup.service';
import swal from "sweetalert2";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdmService} from '../services/adm.service';

@Component({
  selector: 'app-info-startup',
  templateUrl: './info-startup.component.html',
  styleUrls: ['./info-startup.component.css']
})
export class InfoStartupComponent implements OnInit {

  emisor = null; /**Usuario que llamo a la vista**/
  nombreE = null; /**Nombre de la entidad en el sistema**/
  startupsABuscar = null; /**Nombre startup a buscar**/
  resultadoBusqueda = []; /**Arreglo donde estan las startups buscadas**/
  allStartups = null; /**Nombre de la startup en el sistema**/
  /**Variables para administrador**/
  agg = null; /**Variable que representa el boton para agregar un admin**/
  upd = null; /**Variable que representa el boton para actualizar un admin**/
  tipoPeticion = true; /**Representa si la peticion va a ser de agregar o actualizar**/
  admAEliminar = null; /**Administrador a eliminar**/
  admForm: FormGroup; /**Formulario del administrador**/
  adm: any = {}; /**Administrador**/
  correoAdm = null; /**Correo del administrador**/
  contraAdm = null; /**Contraseña del administrador**/
  loading = false;
    /**
     * Metodo constructor, carga todas las startups registradas
     * @param {Router} router perimite redirigirse a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {StartupService} startupService servicios de startup
     * @param {AdmService} admService servicios de administrador
     */
  constructor(private  router: Router, private routerUrl: ActivatedRoute,
              private startupService: StartupService, private admService: AdmService) {
                  this.loading = true;
    this.emisor = this.routerUrl.snapshot.params['emisor'];
    this.nombreE = localStorage.getItem('nombreE');
    this.correoAdm = localStorage.getItem('correo');
      this.startupService.getStartups().subscribe( res => {
          if (res.startups !== null) {
              this.allStartups = res.startups;
              this.allStartups.forEach( el => {
                  this.resultadoBusqueda.push(el);
              });
              this.loading = false;
          } else {
            this.loading = false;
              console.log('No hay startups registradas');
          }
      });
  }
  /**
   * Crea el formulario del administrador
   */
  ngOnInit() {
      this.admForm = new FormGroup({
            'cor': new FormControl(this.adm.cor, [
                Validators.required,
                Validators.email
            ]),
            'con': new FormControl(this.adm.con, [
                Validators.required
            ]),
      });
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
   * Redirecciona a la ventana para crear una convocatoria
   */
  editarInfoC() {
      localStorage.setItem('verC', 'false');
      this.router.navigateByUrl('convocatoriasEntidad/new');
  }
  /**
   * Busca startups por el nombre ingresado
   */
  buscar() {
    this.startupsABuscar = document.getElementById('nombreDeStartup');
    this.resultadoBusqueda = [];
      if (this.startupsABuscar.value === '') {
          this.cargarTabla();
      } else {
          this.startupService.getStartups()
              .subscribe(todasLasStartups => {
                  todasLasStartups.startups.forEach( el => {
                      let agregar = true;
                      if (this.startupsABuscar.value.length <= el.nombre.length) {
                          for (let j = 0; j < this.startupsABuscar.value.length && j < el.nombre.length ; j++) {
                              if (el.nombre.charAt(j).toUpperCase() !== this.startupsABuscar.value.charAt(j).toUpperCase()) {
                                  agregar = false;
                              }
                          }
                          if (agregar === true) {
                              this.resultadoBusqueda.push(el);
                          }
                      }
                  });
              });
      }
  }
  /**
   * carga la tabla con las startups buscadas
   */
  cargarTabla() {
    this.startupService.getStartups()
        .subscribe( res => {
          if (res.startups !== null) {
            this.allStartups = res.startups;
            this.allStartups.forEach( el => {
              this.resultadoBusqueda.push(el);
            });
          } else {
            console.log('No hay startups registradas');
          }}, error => {
            console.log(error);
        });
  }
  /**
   * Redirecciona a la ventana para ver la startup dependiendo del usuario en el sistema
   * @param index startup que se quiere ver
   */
  verInfo(index) {
      if (this.emisor === 'adm') {
          localStorage.setItem('ver', 'true');
          this.router.navigateByUrl('startup/' + this.resultadoBusqueda[index].nombre);
      }if (this.emisor === 'entidad') {
          localStorage.setItem('nombre', this.resultadoBusqueda[index].nombre);
          this.router.navigateByUrl('principalStartup/entidad');
      }
  }
  /**
   * Llama la ventana emergente para agregar un admin
   */
  ventana() {
      this.adm = {};
      this.ngOnInit();
      this.tipoPeticion = true;
      this.agg = document.getElementById('agg');
      this.agg.href = '#ventana1';
  }
  /**
   * Llama la ventana emergente para actualizar un admin
   */
  ventana1() {
      this.admService.getAdmByCorreo(this.correoAdm)
          .subscribe( res => {
              console.log(res.codigo);
              if (res.codigo === '200') {
                  this.adm = res.adm;
          }
              }, error2 => {
              console.log(error2);
          });
      this.tipoPeticion = false;
      this.upd = document.getElementById('upd');
      this.upd.href = '#ventana1';
    }
    /**
     * Guarda un administrador
     */
    guardarAdm() {
        if (!this.admForm.valid) {
            swal('ERROR', 'No es posible guardar los datos', 'error');
        } else {
            this.admService.saveAdm(this.adm).subscribe(
                response => {
                    console.log(response);
                    if (response.codigo.toString() === '200') {
                        if (this.tipoPeticion === true) {
                            swal('¡Hecho!', 'El Administrador Fue Registrado Exitosamente', 'success');
                            this.adm.cor = '';
                            this.adm.con = '';
                        } else {
                            swal('¡Hecho!', 'Tus datos Fueron Actualizados Exitosamente', 'success');
                        }
                    } else {
                        console.log(response.mensaje);
                    }
                }, error => {
                    console.log(error);
                });
        }
    }
    /**
     * Elimina un administrador
     */
    eliminarAdm() {
      this.contraAdm = document.getElementById('contra');
        this.admService.getAdmByCorreo(this.adm.cor)
            .subscribe( admin => {
                this.admAEliminar = admin.adm;
                if (this.admAEliminar.con === this.contraAdm.value) {
                    this.admService.deleteAdm(this.admAEliminar.cor)
                        .subscribe( res => {
                            swal('Hecho', 'Tu Cuenta Fue Eliminada', 'success');
                            this.router.navigateByUrl('');
                        }, error2 => {
                            console.log(error2);
                        });
                } else {
                    this.contraAdm.value = '';
                    swal('Error', 'La Contraseña No Coincide', 'error');
                }
            }, error => {
                console.log(error);
            });
    }

    /**Metodos get**/
    get cor() {
        return this.admForm.get('cor');
    }
    get con() {
        return this.admForm.get('con');
    }
}
