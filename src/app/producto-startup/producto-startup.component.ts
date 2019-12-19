import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductoService} from '../services/producto.service';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from '@angular/router';
import {StartupService} from '../services/startup.service';
import {AdmService} from '../services/adm.service';

@Component({
  selector: 'app-producto-startup',
  templateUrl: './producto-startup.component.html',
  styleUrls: ['./producto-startup.component.css']
})
export class ProductoStartupComponent implements OnInit {
    nombreStartup = null; /**Nombre de la startup en el sistema**/
    nombreProducto = null; /**Nombre del producto actual**/
    producto: any = {}; /**Producto**/
    registerForm: FormGroup; /**Formulario del producto**/
    mensajeAsesoria = false; /**Si no hay asesoria en el producto de la startup esta variable cambia su valor**/
    a = true; b = true; c = true; d = true; e = true; /**Permiten que aparezcan los mensajes de asesoria**/
    habilitar = false; /**Variable para indicar si se habilitan los componentes segun perfil identificador y punto de equilibrio**/
    numeroLlenosProd = 0; /**Numero de campos diligenciados en el formulario del producto**/
    numeroLlenosLetraProd = null; /**Numero en letra de campos diligenciados en el formulario del producto**/
    primeraIteracionCheckbox = true; /**Indica si es la primera iteracion en los checkbox**/
    permisoCheckbox = false; /**Indica si se permite actualizar la barra de progreso cuando se oprima algun checkbox**/
    ver = null; /**Variable para conocer si el usuario que ingreso a la vista es un admin o startup**/
    desabilitar = null; /**Variable para indicar si se habilitan los componentes**/
    startupProdAGuardar = null; /**Startup a la que pertenece el producto**/
    todosLosProducto = null; /**Todos los productos registrados**/
    productoCreado = 0; /**Variable que conoce si el nombre del producto en proceso de registro ya esta registrada**/
    maxLengthInputs = 1000; /**Maxima longitud de los inputs**/
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
     * Metodo constructor, donde se conoce si el usuario que ingreso a la vista es un admin o startup para desabilitar los campos
     * @param {ProductoService} productoService servicios de producto
     * @param {StartupService} startupService servicios de startup
     * @param {Router} router perimite redirigiise a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {AdmService} admService servicios de administrador
     */
    constructor(private productoService: ProductoService, private startupService: StartupService,
                private  router: Router, private routerUrl: ActivatedRoute, private admService: AdmService) {
        this.nombreStartup = localStorage.getItem('nombre');
        this.correoAdm = localStorage.getItem('correo');
        this.nombreProducto = routerUrl.snapshot.params['nombreProd'];
        this.ver = localStorage.getItem('verP');
        if (this.ver === 'true') {
            this.desabilitar = true;
        } else {
            this.desabilitar = false;
        }
    }
    /**
     * Carga los datos del producto si se quiere actualizar y crea su formulario
     */
  ngOnInit() {
      if (this.nombreProducto !== 'new') {
          this.loading = true;
          this.productoService.getProductoByNom(this.nombreProducto)
              .subscribe(response => {
                  if (response.codigo.toString() === '200') {
                      this.producto = response.producto;
                      this.producto.startupProd = this.producto.startupProd.nombre;
                      this.animarProd();
                      if (this.desabilitar === true) {
                          this.llenarCamposParaVer();
                      }
                  } else {
                      console.log(response.mensaje);
                  }
                  this.loading = false;
              }, error => {
                  console.log(error);
              });
      }
      this.registerForm = new FormGroup({
          'nombre': new FormControl(this.producto.nombre, [
              Validators.required,
              Validators.maxLength(this.maxLengthInputs)
          ]),
          'tipoPlataforma': new FormControl(this.producto.tipoPlataforma, []),
          'tipoSolucion': new FormControl(this.producto.tipoSolucion, []),
          'direccionWeb': new FormControl(this.producto.direccionWeb, [Validators.maxLength(this.maxLengthInputs)]),
          'objetivo': new FormControl(this.producto.objetivo, [Validators.maxLength(this.maxLengthInputs)]),
          'direccionApp': new FormControl(this.producto.direccionApp, [Validators.maxLength(this.maxLengthInputs)]),
          'direccionPlay': new FormControl(this.producto.direccionPlay, [Validators.maxLength(this.maxLengthInputs)]),
          'asesoriasValidacion': new FormControl(this.producto.asesoriasValidacion, []),
          'desarrolloNegocio': new FormControl(this.producto.desarrolloNegocio, []),
          'investigacionMercado': new FormControl(this.producto.investigacionMercado, []),
          'arquitecturaEmpresarial': new FormControl(this.producto.arquitecturaEmpresarial, []),
          'desarrolloPlan': new FormControl(this.producto.desarrolloPlan, []),
          'startupProd': new FormControl(this.producto.startupProd, [])
      });
      this.admForm = new FormGroup({
          'cor': new FormControl(this.adm.cor, [
              Validators.required,
              Validators.email
          ]),
          'con': new FormControl(this.adm.con, [
              Validators.required
          ]),
      });
      if (this.desabilitar === false) {
          this.startupService.getStartupByNom(this.nombreStartup)
              .subscribe(response => {
                  this.startupProdAGuardar = response.startup;
                  this.producto.startupProd = this.nombreStartup;
              }, error2 => {
                  console.log(error2);
              });
      }
  }
  /**Metodos de registro de producto**/
    /**
     * Evento del boton agregar
     * Conoce si el nombre del producto ya esta registrado y
     * llama al metodo que responde la solicitud de registro
     */
    aceptar() {
        if (!this.registerForm.valid || this.desabilitar) {
            swal('ERROR', 'No es posible guardar los datos', 'error');
        } else {
            this.loading = true;
            if (this.producto.desarrolloNegocio === false) {
                this.producto.desarrolloNegocio = null;
            }
            if (this.producto.investigacionMercado === false) {
                this.producto.investigacionMercado = null;
            }
            if (this.producto.arquitecturaEmpresarial === false) {
                this.producto.arquitecturaEmpresarial = null;
            }
            if (this.producto.desarrolloPlan === false) {
                this.producto.desarrolloPlan = null;
            }
            this.productoService.getProductos().subscribe(todos => {
                this.productoCreado = 0;
                this.todosLosProducto = todos.productos;
                if (this.todosLosProducto !== null) {
                    this.todosLosProducto.forEach(el => {
                        if (el.nombre.toUpperCase() === this.producto.nombre.toUpperCase()) {
                            this.productoCreado++;
                        }
                    });
                }
                this.crearOActualizar();
            });
        }
    }

    /**
     * Responde si el producto ya fue creada o llama al metodo
     * que realiza la consulta de registro
     */
    crearOActualizar() {
        if (this.nombreProducto === 'new') {
            if (this.productoCreado === 0) {
                this.consultaSave();
            } else {
                swal('¡ERROR!', 'El Nombre Del Producto Ya Se Encuentra Registrado', 'error');
                this.loading = false;
            }
        } else {
            this.consultaSave();
        }
    }
    /**
     * Consulta para agregar o actualizar un producto
     */
    consultaSave() {
        this.producto.startupProd = this.startupProdAGuardar;
        this.productoService.saveProducto(this.producto).subscribe(
            response => {
                console.log(response);
                if (response.codigo.toString() === '200') {
                    if (this.nombreProducto === 'new') {
                        swal('¡Registrado!', 'Tu Producto Fue Registrado Exitosamente', 'success');
                        this.router.navigateByUrl('principalStartup/startup');
                    } else {
                        swal('¡Hecho!', 'Tus Datos Fueron Actualizados Exitosamente', 'success');
                        this.router.navigateByUrl('principalStartup/startup');
                    }
                } else {
                    console.log(response.mensaje);
                }
                this.loading = false;
            }, error => {
                console.log(error);
                this.loading = false;
            });
    }
    /**Fin metodos registro del producto**/

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
     * Redirecciona a la ventana para modificar los datos de la startup
     */
    editarInfo() {
        localStorage.setItem('ver', 'false');
        this.router.navigateByUrl('startup/' + this.nombreStartup);
    }

    /**
     * Redirecciona a la vista para crear un producto
     */
    editarInfoP() {
        localStorage.setItem('verP', 'false');
        this.router.navigateByUrl('productosStartup/new');
    }

    /**
     * Evento del select de asesoriasValidacion
     * @param newValue del select
     */
    habilitarInformacionContexto(newValue) {
        this.producto.asesoriasValidacion = newValue;
        if (typeof this.producto.asesoriasValidacion !== 'undefined' && this.producto.asesoriasValidacion !== null) {
            if (this.producto.asesoriasValidacion === 'Si') {
                this.habilitar = true;
                this.animarProd();
            }
            if (this.producto.asesoriasValidacion === 'No') {
                this.habilitar = false;
                this.producto.desarrolloNegocio = false;
                this.producto.investigacionMercado = false;
                this.producto.arquitecturaEmpresarial = false;
                this.producto.desarrolloPlan = false;
                this.animarProd();
            }
        }
    }

    /**
     * Evento del input nombre que llama al metodo para actualizar la barra de progreso
     */
    animarProdA() {
        if (typeof this.producto.nombre !== 'undefined') {
            if (this.producto.nombre.length === 1 || this.producto.nombre.length === 0) {
                this.animarProd();
            }
        }
    }
    /**
     * Evento del input tipoPlataforma que llama al metodo para actualizar la barra de progreso
     */
    animarProdB(newValue) {
        this.producto.tipoPlataforma = newValue;
        if (typeof this.producto.tipoPlataforma !== 'undefined' && this.producto.tipoPlataforma !== null) {
            if (this.producto.tipoPlataforma.length >= 0) {
                this.animarProd();
            }
        }
    }
    /**
     * Evento del input tipoSolucion que llama al metodo para actualizar la barra de progreso
     */
    animarProdC(newValue) {
        this.producto.tipoSolucion = newValue;
        if (typeof this.producto.tipoSolucion !== 'undefined' && this.producto.tipoSolucion !== null) {
            if (this.producto.tipoSolucion.length >= 0) {
                this.animarProd();
            }
        }
    }
    /**
     * Evento del input direccionWeb que llama al metodo para actualizar la barra de progreso
     */
    animarProdD() {
        if (typeof this.producto.direccionWeb !== 'undefined') {
            if (this.producto.direccionWeb.length === 1 || this.producto.direccionWeb.length === 0) {
                this.animarProd();
            }
        }
    }
    /**
     * Evento del input objetivo que llama al metodo para actualizar la barra de progreso
     */
    animarProdE() {
        if (typeof this.producto.objetivo !== 'undefined') {
            if (this.producto.objetivo.length === 1 || this.producto.objetivo.length === 0) {
                this.animarProd();
            }
        }
    }
    /**
     * Evento del input direccionApp que llama al metodo para actualizar la barra de progreso
     */
    animarProdF() {
        if (typeof this.producto.direccionApp !== 'undefined') {
            if (this.producto.direccionApp.length === 1 || this.producto.direccionApp.length === 0) {
                this.animarProd();
            }
        }
    }
    /**
     * Evento del input direccionPlay que llama al metodo para actualizar la barra de progreso
     */
    animarProdG() {
        if (typeof this.producto.direccionPlay !== 'undefined') {
            if (this.producto.direccionPlay.length === 1 || this.producto.direccionPlay.length === 0) {
                this.animarProd();
            }
        }
    }
    /**
     * Evento de los checkbox para darle un valor a asesoriasValidacion si no lo tiene
     */
    eventoCheck() {
        if (this.producto.desarrolloNegocio === true) {
            this.producto.asesoriasValidacion = 'Si';
            this.habilitar = true;
        }if (this.producto.investigacionMercado === true) {
            this.producto.asesoriasValidacion = 'Si';
            this.habilitar = true;
        }if (this.producto.arquitecturaEmpresarial === true) {
            this.producto.asesoriasValidacion = 'Si';
            this.habilitar = true;
        }if (this.producto.desarrolloPlan === true) {
            this.producto.asesoriasValidacion = 'Si';
            this.habilitar = true;
        }
    }

    /**Metodos get**/
    get startupProd() {
        return this.registerForm.get('startupProd');
    }
    get nombre() {
        return this.registerForm.get('nombre');
    }
    get tipoPlataforma() {
        return this.registerForm.get('tipoPlataforma');
    }
    get tipoSolucion() {
        return this.registerForm.get('tipoSolucion');
    }
    get direccionWeb() {
        return this.registerForm.get('direccionWeb');
    }
    get objetivo() {
        return this.registerForm.get('objetivo');
    }
    get direccionApp() {
        return this.registerForm.get('direccionApp');
    }
    get direccionPlay() {
        return this.registerForm.get('direccionPlay');
    }
    get asesoriasValidacion() {
        return this.registerForm.get('asesoriasValidacion');
    }
    get desarrolloNegocio() {
        return this.registerForm.get('desarrolloNegocio');
    }
    get investigacionMercado() {
        return this.registerForm.get('investigacionMercado');
    }
    get arquitecturaEmpresarial() {
        return this.registerForm.get('arquitecturaEmpresarial');
    }
    get desarrolloPlan() {
        return this.registerForm.get('desarrolloPlan');
    }
    /**
     * Actualiza la barra de progreso de la informacion de producto
     * */
    animarProd() {
        if (this.desabilitar === false) {
            this.camposLlenosProd();
            if (this.numeroLlenosProd === 0 && this.numeroLlenosLetraProd !== 'cero') {
                this.numeroLlenosLetraProd = 'cero';
            }if (this.numeroLlenosProd === 1 && this.numeroLlenosLetraProd !== 'doce') {
                this.numeroLlenosLetraProd = 'doce';
                document.getElementById('progresoProd').classList.toggle('doce');
            }if (this.numeroLlenosProd === 2 && this.numeroLlenosLetraProd !== 'veci') {
                this.numeroLlenosLetraProd = 'veci';
                document.getElementById('progresoProd').classList.toggle('veci');
            }if (this.numeroLlenosProd === 3 && this.numeroLlenosLetraProd !== 'trsi') {
                this.numeroLlenosLetraProd = 'trsi';
                document.getElementById('progresoProd').classList.toggle('trsi');
            }if (this.numeroLlenosProd === 4 && this.numeroLlenosLetraProd !== 'cita') {
                this.numeroLlenosLetraProd = 'cita';
                document.getElementById('progresoProd').classList.toggle('cita');
            }if (this.numeroLlenosProd === 5 && this.numeroLlenosLetraProd !== 'sesdo') {
                this.numeroLlenosLetraProd = 'sesdo';
                document.getElementById('progresoProd').classList.toggle('sesdo');
            }if (this.numeroLlenosProd === 6 && this.numeroLlenosLetraProd !== 'seci') {
                this.numeroLlenosLetraProd = 'seci';
                document.getElementById('progresoProd').classList.toggle('seci');
            }if (this.numeroLlenosProd === 7 && this.numeroLlenosLetraProd !== 'ococ') {
                this.numeroLlenosLetraProd = 'ococ';
                document.getElementById('progresoProd').classList.toggle('ococ');
            }if (this.numeroLlenosProd === 8 && this.numeroLlenosLetraProd !== 'cien') {
                this.numeroLlenosLetraProd = 'cien';
                document.getElementById('progresoProd').classList.toggle('cien');
            }
        }
    }
    /**
     * Define cuantos campos estan llenos para actualizar la barra de progreso de la informacion del producto
     */
    camposLlenosProd() {
        this.numeroLlenosProd = 0;
        if (typeof this.producto.nombre !== 'undefined' && this.producto.nombre !== null) {
            if (this.producto.nombre.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
        if (typeof this.producto.tipoPlataforma !== 'undefined' && this.producto.tipoPlataforma !== null) {
            if (this.producto.tipoPlataforma.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
        if (typeof this.producto.tipoSolucion !== 'undefined' && this.producto.tipoSolucion !== null) {
            if (this.producto.tipoSolucion.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
        if (typeof this.producto.direccionWeb !== 'undefined' && this.producto.direccionWeb !== null) {
            if (this.producto.direccionWeb.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
        if (typeof this.producto.objetivo !== 'undefined' && this.producto.objetivo !== null) {
            if (this.producto.objetivo.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
        if (typeof this.producto.direccionApp !== 'undefined' && this.producto.direccionApp !== null) {
            if (this.producto.direccionApp.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
        if (typeof this.producto.direccionPlay !== 'undefined' && this.producto.direccionPlay !== null) {
            if (this.producto.direccionPlay.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
        if (typeof this.producto.asesoriasValidacion !== 'undefined' && this.producto.asesoriasValidacion !== null) {
            if (this.producto.asesoriasValidacion.length !== 0) {
                this.numeroLlenosProd++;
            }
        }
    }

    /**
     * Pone un mensaje en los campos que no han sido diligenciados cuando se quiere ver la informacion
     */
    llenarCamposParaVer () {
        if (typeof this.producto.nombre === 'undefined' || this.producto.nombre === null) {
            this.producto.nombre = 'No ha sido deligenciado.';
        }if (typeof this.producto.tipoPlataforma === 'undefined' || this.producto.tipoPlataforma === null) {
            this.producto.tipoPlataforma = 'No ha sido deligenciado.';
        }if (typeof this.producto.tipoSolucion === 'undefined' || this.producto.tipoSolucion === null) {
            this.producto.tipoSolucion = 'No ha sido deligenciado.';
        }if (typeof this.producto.direccionWeb === 'undefined' || this.producto.direccionWeb === null) {
            this.producto.direccionWeb = 'No ha sido deligenciado.';
        }if (typeof this.producto.objetivo === 'undefined' || this.producto.objetivo === null) {
            this.producto.objetivo = 'No ha sido deligenciado.';
        }if (typeof this.producto.direccionApp === 'undefined' || this.producto.direccionApp === null) {
            this.producto.direccionApp = 'No ha sido deligenciado.';
        }if (typeof this.producto.direccionPlay === 'undefined' || this.producto.direccionPlay === null) {
            this.producto.direccionPlay = 'No ha sido deligenciado.';
        }
        if (typeof this.producto.desarrolloNegocio === 'undefined' || this.producto.desarrolloNegocio === null) {
            this.a = false;
        }
        if (typeof this.producto.investigacionMercado === 'undefined' || this.producto.investigacionMercado === null) {
            this.b = false;
        }
        if (typeof this.producto.arquitecturaEmpresarial === 'undefined' || this.producto.arquitecturaEmpresarial === null) {
            this.c = false;
        }
        if (typeof this.producto.desarrolloPlan === 'undefined' || this.producto.desarrolloPlan === null) {
            this.d = false;
        }
        if (this.a === false && this.b === false && this.c === false && this.d === false) {
            this.mensajeAsesoria = true;
        }
    }




    /**Metodos para grestionar un adm**/
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
        this.loading = true;
        this.contraAdm = document.getElementById('contraAdm');
        this.admService.getAdmByCorreo(this.adm.cor)
            .subscribe( admin => {
                this.admAEliminar = admin.adm;
                if (this.admAEliminar.con === this.contraAdm.value) {
                    this.admService.deleteAdm(this.admAEliminar.cor)
                        .subscribe( res => {
                            swal('Hecho', 'Tu Cuenta Fue Eliminada', 'success');
                            this.router.navigateByUrl('');
                            this.loading = false;
                        }, error2 => {
                            console.log(error2);
                        });
                } else {
                    this.contraAdm.value = '';
                    swal('Error', 'La Contraseña No Coincide', 'error');
                    this.loading = false;
                }
            }, error => {
                console.log(error);
                this.loading = false;
            });
    }
    /**Fin metodos gestion adm**/
}
