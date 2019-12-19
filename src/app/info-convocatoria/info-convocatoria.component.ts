import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConvocatoriaService} from '../services/convocatoria.service';
import {EntidadService} from '../services/entidad.service';
import swal from "sweetalert2";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdmService} from '../services/adm.service';

@Component({
  selector: 'app-info-convocatoria',
  templateUrl: './info-convocatoria.component.html',
  styleUrls: ['./info-convocatoria.component.css']
})
export class InfoConvocatoriaComponent implements OnInit {
  nombreE = null; /**Nombre de la entidad en el sistema**/
  entidadActual = null; /****/
  convocatoriasABuscar = null; /****/
  resultadoBusqueda = []; /**Arreglo donde estan las convocatorias buscadas**/
  allConvocatorias = null; /**Todas las convocatorias registradas**/
  nombreConvocatoriaABorrar = null; /**Nombre de la convocatoria a eliminar**/
  emisorC = null; /**Variable que representa si el usuario que ingreso es un admin o entidad**/
  ver = null; /**Variable que desabilita los componentes**/
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
     * Metodo constructor, carga todas las convocatorias registradas
     * @param {Router} router perimite redirigiise a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {ConvocatoriaService} convocatoriaService servicios de convocatoria
     * @param {EntidadService} entidadService servicios de entidad
     * @param {AdmService} admService servicios de administrador
     */
  constructor(private router: Router, private routerUrl: ActivatedRoute, private convocatoriaService: ConvocatoriaService,
              private entidadService: EntidadService, private admService: AdmService) {
        this.loading = true;
      this.emisorC = routerUrl.snapshot.params['emisorC'];
      this.correoAdm = localStorage.getItem('correo');
      if (this.emisorC === 'adm') {
          this.ver = true;
          this.convocatoriaService.getConvocatorias().subscribe( res => {
              if (res.convocatorias !== null) {
                  this.allConvocatorias = res.convocatorias;
                  this.allConvocatorias.forEach( el => {
                      this.resultadoBusqueda.push(el);
                  });
                this.loading = false;
              } else {
                    this.loading = false;
                  console.log('No hay convocatorias registradas');
              }
          });
      } else {
          this.ver = false;
          this.nombreE = localStorage.getItem('nombreE');
          localStorage.setItem('verC', 'false');
          this.entidadService.getEntidadByNom(this.nombreE)
              .subscribe(result => {
                  this.entidadActual = result.entidad;
                  this.convocatoriaService.getConvocatoriaByEntidad(this.entidadActual.id).subscribe( res => {
                      if (res.convocatorias !== null) {
                          this.allConvocatorias = res.convocatorias;
                          this.allConvocatorias.forEach( el => {
                              this.resultadoBusqueda.push(el);
                          });
                      } else {
                    this.loading = false;
                          console.log('No hay convocatorias registradas');
                      }
                  });
                  this.loading = false;
              }, error2 => {
                this.loading = false;
                  console.log(error2);
              });
      }
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
   * Redirecciona a la vista del perfil de la entidad
   */
  editarInfoE() {
    localStorage.setItem('verE', 'false');
    this.router.navigateByUrl('entidad/' + this.nombreE);
  }

  /**
   * Redirecciona a la vista para crear a una convocatoria
   */
  editarInfoC() {
      localStorage.setItem('verC', 'false');
      this.router.navigateByUrl('convocatoriasEntidad/new');
  }
  /**
   * Busca convocatorias por el nombre ingresado
   */
  buscar() {
      this.convocatoriasABuscar = document.getElementById('nombreDeConvocatoria');
      this.resultadoBusqueda = [];
      if (this.convocatoriasABuscar.value === '') {
          this.cargarTabla();
      } else {
          if (this.emisorC === 'adm') {
              this.convocatoriaService.getConvocatorias()
                  .subscribe(todosLasConvocatorias => {
                      todosLasConvocatorias.convocatorias.forEach( el => {
                          let agregar = true;
                          if (this.convocatoriasABuscar.value.length <= el.nombre.length) {
                              for (let j = 0; j < this.convocatoriasABuscar.value.length && j < el.nombre.length ; j++) {
                                  if (el.nombre.charAt(j).toUpperCase() !== this.convocatoriasABuscar.value.charAt(j).toUpperCase()) {
                                      agregar = false;
                                  }
                              }
                              if (agregar === true) {
                                  this.resultadoBusqueda.push(el);
                              }
                          }
                      });
                  });
          } else {
              this.convocatoriaService.getConvocatoriaByEntidad(this.entidadActual.id)
                  .subscribe(todasLasConvocatorias  => {
                      todasLasConvocatorias.productos.forEach( el => {
                          let agregar = true;
                          if (this.convocatoriasABuscar.value.length <= el.nombre.length) {
                              for (let j = 0; j < this.convocatoriasABuscar.value.length && j < el.nombre.length ; j++) {
                                    if (el.nombre.charAt(j).toUpperCase() !== this.convocatoriasABuscar.value.charAt(j).toUpperCase()) {
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
    }
    /**
     * Elimina una convocatoria
     * @param index de la convocatoria seleccionada para eliminar
     */
    eliminar(index) {
        swal({
            title: '¿Seguro?',
            text: '¿Deseas eliminar la convocatoria seleccionada?',
            type: 'warning',
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
            confirmButtonColor: '#0072af',
            showCancelButton: true,
            showConfirmButton: true
        }).then(isConfirm => {
            if (isConfirm.value === true) {
                this.convocatoriaService.getConvocatoriaByNom(this.resultadoBusqueda[index].nombre)
                    .subscribe( conv => {
                        this.nombreConvocatoriaABorrar = conv.convocatoria.nombre;
                        this.convocatoriaService.deleteConvocatoria(this.nombreConvocatoriaABorrar)
                            .subscribe( res => {
                                console.log(res.codigo);
                                this.resultadoBusqueda.splice(index, 1);
                                this.resultadoBusqueda = [];
                                this.cargarTabla();
                                swal('Hecho', 'La convocatoria fue eliminada correctamente', 'success');
                            });
                    }, error => {
                        console.log(error);
                    });
            }
        });
    }
    /**
     * carga la tabla con las convocatorias buscadas
     */
    cargarTabla() {
        if (this.emisorC === 'adm') {
            this.convocatoriaService.getConvocatorias()
                .subscribe( res => {
                    if (res.convocatorias !== null) {
                        this.allConvocatorias = res.convocatorias;
                        this.allConvocatorias.forEach( el => {
                            this.resultadoBusqueda.push(el);
                        });
                    } else {
                        console.log('No hay convocatorias registradas');
                    }}, error => {
                    console.log(error);
                });
        } else {
            this.convocatoriaService.getConvocatoriaByEntidad(this.entidadActual.id)
                .subscribe( res => {
                    if (res.convocatorias !== null) {
                        this.allConvocatorias = res.convocatorias;
                        this.allConvocatorias.forEach( el => {
                            this.resultadoBusqueda.push(el);
                        });
                    } else {
                        console.log('No hay convocatorias registradas');
                    }
                }, error => {
                    console.log(error);
                });
        }
    }
    /**
     * Llama la ventana emergente para agregar un admin
     */
    ventana6() {
        this.adm = {};
        this.ngOnInit();
        this.tipoPeticion = true;
        this.agg = document.getElementById('aggC');
        this.agg.href = '#ventana2';
    }
    /**
     * Llama la ventana emergente para actualizar un admin
     */
    ventana7() {
        this.admService.getAdmByCorreo(this.correoAdm)
            .subscribe( res => {
                if (res.codigo === '200') {
                    this.adm = res.adm;
                }
            }, error2 => {
                console.log(error2);
            });
        this.tipoPeticion = false;
        this.upd = document.getElementById('updC');
        this.upd.href = '#ventana2';
    }
    /**
     * Guarda un administrador
     */
    guardarAdmC() {
        if (!this.admForm.valid) {
            swal('ERROR', 'No es posible guardar los datos', 'error');
        } else {
            this.admService.saveAdm(this.adm).subscribe(
                response => {
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
    eliminarAdmC() {
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
     * Modifica la variable ver si el estado de la convocatoria es Abierta o Cerrada
     */
    verInfoConvocatoria(index) {
      if (this.emisorC === 'adm') {
        this.ver = true;
        localStorage.setItem('verC', 'true');
        localStorage.setItem('entidadC', 'adm');
        localStorage.setItem('startupNom', '');
      }else{
        this.ver = false;
        localStorage.setItem('verC', 'true');
        localStorage.setItem('entidadC', 'entidad');
        localStorage.setItem('startupNom', '');
      }
        
        this.router.navigateByUrl('convocatoriasEntidad/' + this.resultadoBusqueda[index].nombre);
    }
}
