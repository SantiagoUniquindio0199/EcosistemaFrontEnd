import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdmService} from '../services/adm.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EntidadService} from '../services/entidad.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-info-entidad',
  templateUrl: './info-entidad.component.html',
  styleUrls: ['./info-entidad.component.css']
})
export class InfoEntidadComponent implements OnInit {

  emisor = null; /**Usuario que llamo a la vista**/
  nombre = null; /**Nombre de la startup en el sistema**/
  entidadABuscar = null; /**Nombre entidad a buscar**/
  resultadoBusqueda = []; /**Arreglo donde estan las entidades buscadas**/
  allEntidades = null; /**Todas las entidades registradas**/
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
     * Metodo constructor, carga todas las entidades registradas
     * @param {Router} router perimite redirigirse a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {EntidadService} entidadService servicios de entidad
     * @param {AdmService} admService servicios de administrador
     */
  constructor(private router: Router, private routerUrl: ActivatedRoute,
              private entidadService: EntidadService, private admService: AdmService) {
                  this.loading = true;
      this.emisor = this.routerUrl.snapshot.params['emisorE'];
      this.nombre = localStorage.getItem('nombre');
      this.correoAdm = localStorage.getItem('correo');
      this.entidadService.getEntidades().subscribe( res => {
          if (res.entidades !== null) {
              this.allEntidades = res.entidades;
              this.allEntidades.forEach( el => {
                  this.resultadoBusqueda.push(el);
              });
          } else {
              console.log('No hay entidades registradas');
          }
          this.loading = false;
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
     * Redirecciona a la ventana para crear un producto
     */
    editarInfoP() {
        localStorage.setItem('verP', 'false');
        this.router.navigateByUrl('productosStartup/new');
    }
    /**
     * Busca entidades por el nombre ingresado
     */
    buscar() {
        this.entidadABuscar = document.getElementById('nombreDeEntidad');
        this.resultadoBusqueda = [];
        if (this.entidadABuscar.value === '') {
            this.cargarTabla();
        } else {
            this.entidadService.getEntidades()
                .subscribe(todasLasEntidades => {
                    todasLasEntidades.entidades.forEach( el => {
                        let agregar = true;
                        if (this.entidadABuscar.value.length <= el.nombre.length) {
                            for (let j = 0; j < this.entidadABuscar.value.length && j < el.nombre.length ; j++) {
                                if (el.nombre.charAt(j).toUpperCase() !== this.entidadABuscar.value.charAt(j).toUpperCase()) {
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
     * carga la tabla con las entidades buscadas
     */
    cargarTabla() {
        this.entidadService.getEntidades()
            .subscribe( res => {
                if (res.entidades !== null) {
                    this.allEntidades = res.entidades;
                    this.allEntidades.forEach( el => {
                        this.resultadoBusqueda.push(el);
                    });
                } else {
                    console.log('No hay entidades registradas');
                }}, error => {
                console.log(error);
            });
    }

    /***
     * Redirecciona a la ventana para ver la entidad dependiendo del usuario en el sistema
     * @param index entidad que se quiere ver
     */
    verInfoE(index) {
        if (this.emisor === 'adm') {
            localStorage.setItem('verE', 'true');
            this.router.navigateByUrl('entidad/' + this.resultadoBusqueda[index].nombre);
        }if (this.emisor === 'startup') {
            localStorage.setItem('nombreE', this.resultadoBusqueda[index].nombre);
            this.router.navigateByUrl('principalEntidad/startup');
        }
    }
    /**
     * Llama la ventana emergente para agregar un admin
     */
    ventana2() {
        this.adm = {};
        this.ngOnInit();
        this.tipoPeticion = true;
        this.agg = document.getElementById('aggE');
        this.agg.href = '#ventana2';
    }
    /**
     * Llama la ventana emergente para actualizar un admin
     */
    ventana3() {
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
        this.upd = document.getElementById('updE');
        this.upd.href = '#ventana2';
    }
    /**
     * Guarda un administrador
     */
    guardarAdmE() {
        if (!this.admForm.valid) {
            swal('ERROR', 'No es posible guardar los datos', 'error');
        } else {
            this.admService.saveAdm(this.adm).subscribe(
                response => {
                    console.log(response);
                    if (response.codigo.toString() === '200') {
                        if (this.tipoPeticion === true) {
                            console.log('ok');
                            swal('¡Hecho!', 'El Administrador Fue Registrado Exitosamente', 'success');
                            this.adm.cor = '';
                            this.adm.con = '';
                        } else {
                            console.log('ok');
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
    eliminarAdmE() {
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
    /**Metodos get**/
    get cor() {
        return this.admForm.get('cor');
    }
    get con() {
        return this.admForm.get('con');
    }
    /**Fin metodos get**/
}
