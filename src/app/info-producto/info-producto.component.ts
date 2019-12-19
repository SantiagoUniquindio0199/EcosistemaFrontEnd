import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductoService} from '../services/producto.service';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from '@angular/router';
import {StartupService} from '../services/startup.service';
import {AdmService} from '../services/adm.service';

@Component({
  selector: 'app-info-producto',
  templateUrl: './info-producto.component.html',
  styleUrls: ['./info-producto.component.css']
})
export class InfoProductoComponent implements OnInit {

    nombre = null; /**Nombre de la satrtup en el sistema**/
    startupActual = null; /**Startup en el sistema**/
    productosABuscar = null; /**Nombre de los productos a buscar**/
    resultadoBusqueda = []; /**Arreglo donde estan los productos buscadas**/
    allProductos = null; /**Todos los productos registrados**/
    nombreProductoABorrar = null; /**Nombre del producto a borrar**/
    emisorP = null; /**Usuario que llama a la vista**/
    ver = null; /**Variable para saber si desabilitar los componentes**/
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
     * Metodo constructor, carga todos los productos registrados
     * @param {Router} router perimite redirigirse a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {StartupService} startupService servicios de startup
     * @param {AdmService} admService servicios de administrador
     */
    constructor(private productoService: ProductoService, private routerUrl: ActivatedRoute, private router: Router,
                private startupService: StartupService, private admService: AdmService) {
                    this.loading = true;
        this.emisorP = routerUrl.snapshot.params['emisorP'];
        this.correoAdm = localStorage.getItem('correo');
        if (this.emisorP === 'adm') {
            this.ver = true;
            localStorage.setItem('verP', 'true');
            this.productoService.getProductos().subscribe( res => {
                if (res.productos !== null) {
                    this.allProductos = res.productos;
                    this.allProductos.forEach( el => {
                        this.resultadoBusqueda.push(el);
                    });
                } else {
                    console.log('No hay productos registrados');
                }
                this.loading = false;
            });
        } else {
            this.ver = false;
            this.nombre = localStorage.getItem('nombre');
            localStorage.setItem('verP', 'false');
            this.startupService.getStartupByNom(this.nombre)
                .subscribe(result => {
                    this.startupActual = result.startup;
                    this.productoService.getProductoByStartup(this.startupActual.id).subscribe( res => {
                        if (res.productos !== null) {
                            this.allProductos = res.productos;
                            this.allProductos.forEach( el => {
                                this.resultadoBusqueda.push(el);
                            });
                        } else {
                            console.log('No hay productos registrados');
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
   * Redirecciona a la ventana para actualizar el perfil de la startup
   */
  editarInfo() {
        localStorage.setItem('ver', 'false');
        this.router.navigateByUrl('startup/' + this.nombre);
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
      this.productosABuscar = document.getElementById('nombreDelProducto');
      this.resultadoBusqueda = [];
      if (this.productosABuscar.value === '') {
          this.cargarTabla();
      } else {
          if (this.emisorP === 'adm') {
              this.productoService.getProductos()
                  .subscribe(todosLosProductos => {
                      todosLosProductos.productos.forEach( el => {
                          let agregar = true;
                          if (this.productosABuscar.value.length <= el.nombre.length) {
                              for (let j = 0; j < this.productosABuscar.value.length && j < el.nombre.length ; j++) {
                                  if (el.nombre.charAt(j).toUpperCase() !== this.productosABuscar.value.charAt(j).toUpperCase()) {
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
              this.productoService.getProductoByStartup(this.startupActual.id)
                  .subscribe(todosLosProductos  => {
                      todosLosProductos.productos.forEach( el => {
                          let agregar = true;
                          if (this.productosABuscar.value.length <= el.nombre.length) {
                              for (let j = 0; j < this.productosABuscar.value.length && j < el.nombre.length ; j++) {
                                  if (el.nombre.charAt(j).toUpperCase() !== this.productosABuscar.value.charAt(j).toUpperCase()) {
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
   * Elimina un producto
   * @param index del producto seleccionado para eliminar
   */
  eliminar(index) {
      swal({
          title: '¿Seguro?',
          text: '¿Deseas eliminar el producto seleccionado?',
          type: 'warning',
          cancelButtonText: 'No',
          confirmButtonText: 'Si',
          confirmButtonColor: '#0072af',
          showCancelButton: true,
          showConfirmButton: true
      }).then(isConfirm => {
          if (isConfirm.value === true) {
              this.productoService.getProductoByNom(this.resultadoBusqueda[index].nombre)
                  .subscribe( prod => {
                      this.nombreProductoABorrar = prod.producto.nombre;
                      this.productoService.deleteProducto(this.nombreProductoABorrar)
                          .subscribe( res => {
                              console.log(res.codigo);
                              this.resultadoBusqueda.splice(index, 1);
                              this.resultadoBusqueda = [];
                              this.cargarTabla();
                              swal('Hecho', 'El producto fue eliminado correctamente', 'success');
                          });
                  }, error => {
                      console.log(error);
                  });
          }
      });
  }
    /**
     * carga la tabla con los productos buscados
     */
    cargarTabla() {
        if (this.emisorP === 'adm') {
            this.productoService.getProductos()
                .subscribe( res => {
                    if (res.productos !== null) {
                        this.allProductos = res.productos;
                        this.allProductos.forEach( el => {
                            this.resultadoBusqueda.push(el);
                        });
                    } else {
                        console.log('No hay productos registrados');
                    }}, error => {
                    console.log(error);
                });
        } else {
            this.productoService.getProductoByStartup(this.startupActual.id)
                .subscribe( res => {
                    if (res.productos !== null) {
                        this.allProductos = res.productos;
                        this.allProductos.forEach( el => {
                            this.resultadoBusqueda.push(el);
                        });
                    } else {
                        console.log('No hay productos registrados');
                    }
                }, error => {
                    console.log(error);
                });
        }
    }
    /**
     * Llama la ventana emergente para agregar un admin
     */
    ventana4() {
        this.adm = {};
        this.ngOnInit();
        this.tipoPeticion = true;
        this.agg = document.getElementById('aggP');
        this.agg.href = '#ventana2';
    }
    /**
     * Llama la ventana emergente para actualizar un admin
     */
    ventana5() {
        this.admService.getAdmByCorreo(this.correoAdm)
            .subscribe( res => {
                if (res.codigo === '200') {
                    this.adm = res.adm;
                }
            }, error2 => {
                console.log(error2);
            });
        this.tipoPeticion = false;
        this.upd = document.getElementById('updP');
        this.upd.href = '#ventana2';
    }
    /**
     * Guarda un administrador
     */
    guardarAdmP() {
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
    eliminarAdmP() {
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
}
