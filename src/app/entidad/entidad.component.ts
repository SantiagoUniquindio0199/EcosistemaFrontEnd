import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EntidadService} from '../services/entidad.service';
import swal from "sweetalert2";
import {AdmService} from '../services/adm.service';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.css']
})
export class EntidadComponent implements OnInit {

  entidad: any = {}; /**Entidad en proceso de registro o ingresada en el sistema**/
  registerForm: FormGroup; /**Formulario de la entidad**/
  originalNombreLogeo = null; /**Nombre que se ingreso para logearse en el sistema**/
  numeroLlenosE = 0; /**Numero de campos diligenciados en el formulario de la entidad**/
  numeroLlenosLetraE = null; /**Numero en letra de campos diligenciados en el formulario de la entidad**/
  nombreEntidad = null; /**Nombre de la entidad que ingreso al sistema**/
  minLengthPass = 6; /**Minimo numero de caracteres que debe tener la contraseña**/
  nombreE = null; /**Variable que representa el nombre d ela entidad para mandarla a otras vistas**/
  entidadAEliminar = null; /**Entidad que se quiere eliminar**/
  ver = null; /**Variable para conocer si el usuario que ingreso a la vista es un admin o entidad**/
  desabilitar = null; /**Variable para desabilitar los campos del formulario**/
  habilitarFoto = false; /**Variable que habilita el boton para agregar la foto*/
  verBotonEliminar = false; /**Variable que permite ver el boton de eliminar**/
  contraParaEliminar = null; /**Contraseña que se ingresa para verificar si se elimina la entidad**/
  ventanaEliminar = null; /**Variable que representa el boton que llama la ventana emergente de eliminar**/
  todasLasEntidades = null; /**Variable que representa todas las entidades registradas**/
  url = '../../assets/default.jpg'; /**Url inicial de la foto de perfil de la entidad**/
  entidadCreada = 0; /**Variable que conoce si el nombre de la entidad en proceso de registro ya esta registrada**/
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
     * Metodo constructor donde se conoce si el usuario que ingreso a la vista es un admin o entidad para desabilitar los campos
     * @param {EntidadService} entidadService servicios de la entidad
     * @param {Router} router perimite redirigiise a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {AdmService} admService servicios de administrador
     */
  constructor(private entidadService: EntidadService, private  router: Router, private routerUrl: ActivatedRoute,
              private admService: AdmService) {
      this.nombreEntidad = routerUrl.snapshot.params['nombreE'];
      this.correoAdm = localStorage.getItem('correo');
      this.originalNombreLogeo = localStorage.getItem('nombreE');
      this.ver = localStorage.getItem('verE');
      if (this.ver === 'false' && this.nombreEntidad !== 'new' ) {
          if (this.nombreEntidad !== this.originalNombreLogeo) {
              swal('Lo sentimos!', 'No tienes permiso para entrar aqui', 'error');
              this.router.navigateByUrl('');
          }
      }
      this.nombreE = this.nombreEntidad;
      if (this.ver === 'true') {
          this.desabilitar = true;
      } else {
          this.desabilitar = false;
      }if (this.nombreEntidad !== 'new') {
          this.verBotonEliminar = true;
      } else {
          this.verBotonEliminar = false;
      }
  }

  /**
   * Carga los datos de la entidad si se quiere actualizar y crea su formulario
   */
  ngOnInit() {
      if (this.nombreEntidad !== 'new') {
          this.loading = true;
          this.entidadService.getEntidadByNom(this.nombreEntidad)
              .subscribe(response => {
                  if (response.codigo.toString() === '200') {
                      this.habilitarFoto = true;
                      this.entidad = response.entidad;
                      this.url = this.entidad.foto;
                      this.animarE();
                      if (this.desabilitar === true) {
                          this.llenarCamposParaVer();
                      }
                      this.loading = false;
                  } else {
                      console.log(response.mensaje);
                  }
              }, error => {
                  console.log(error);
              });
      }

      this.registerForm = new FormGroup({
          'foto': new FormControl(this.entidad.foto, []),
          'nombre': new FormControl(this.entidad.nombre, [
              Validators.required,
              Validators.maxLength(this.maxLengthInputs)
          ]),
          'contrasena': new FormControl(this.entidad.contrasena, [
              Validators.required,
              Validators.minLength(this.minLengthPass),
              Validators.maxLength(20)
          ]),
          'tipo': new FormControl(this.entidad.tipo, []),
          'descripcion': new FormControl(this.entidad.descripcion, [
              Validators.required,
              Validators.maxLength(this.maxLengthInputs)
          ]),
          'telefono': new FormControl(this.entidad.telefono, [
              Validators.pattern('[0-9]*'),
              Validators.maxLength(20)
          ]),
          'direccionWeb': new FormControl(this.entidad.direccionWeb, [
              Validators.maxLength(this.maxLengthInputs)
          ]),
          'correo': new FormControl(this.entidad.correo, [
              Validators.maxLength(this.maxLengthInputs),
              Validators.maxLength(50)
          ]),
          'facebook': new FormControl(this.entidad.facebook, [Validators.maxLength(this.maxLengthInputs)]),
          'linkedln': new FormControl(this.entidad.linkedln, [Validators.maxLength(this.maxLengthInputs)]),
          'twitter': new FormControl(this.entidad.twitter, [Validators.maxLength(this.maxLengthInputs)]),
          'instagram': new FormControl(this.entidad.instagram, [Validators.maxLength(this.maxLengthInputs)]),
          'direccion': new FormControl(this.entidad.direccion, [Validators.maxLength(this.maxLengthInputs)]),
          'ciudad': new FormControl(this.entidad.ciudad, [Validators.maxLength(this.maxLengthInputs)]),
          'departamento': new FormControl(this.entidad.departamento, [Validators.maxLength(this.maxLengthInputs)])
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
      this.entidad.foto = '../../assets/default.jpg';
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

 /**Metodos para registrar una entidad**/

    /**
     * Evento del boton agregar
     * Conoce si el nombre de la entidad ya esta registrado y
     * llama al metodo que responde la solicitud de registro
     */
    aceptar() {
        if (!this.registerForm.valid || this.desabilitar) {
            swal('ERROR', 'No es posible guardar los datos', 'error');
        } else {
            this.loading = true;
            this.entidadService.getEntidades().subscribe(todas => {
                this.entidadCreada = 0;
                this.todasLasEntidades = todas.entidades;
                if (this.todasLasEntidades !== null) {
                    this.todasLasEntidades.forEach(el => {
                        if (el.nombre.toUpperCase() === this.entidad.nombre.toUpperCase()) {
                            this.entidadCreada++;
                        }
                    });
                }
                this.crearOActualizar();
            }, error2 => {
                this.loading = false;
                console.log(error2);
            });
        }
    }

    /**
     * Responde si la entidad ya fue creada o llama al metodo
     * que realiza la consulta de registro
     */
    crearOActualizar() {
        if (this.nombreEntidad === 'new') {
            if (this.entidadCreada === 0) {
                this.consultaSave();
            } else {
                this.loading = false;
                swal('¡ERROR!', 'El Nombre De La Entidad Ya Se Encuentra Registrado', 'error');
            }
        } else {
            this.consultaSave();
        }
    }

    /**
     * Consulta para agregar o actualizar una entidad
     */
    consultaSave() {
        this.entidadService.saveEntidad(this.entidad).subscribe(
            response => {
                if (response.codigo.toString() === '200') {
                    if (this.nombreEntidad === 'new') {
                        localStorage.setItem('nombreE', this.entidad.nombre);
                        localStorage.setItem('usuarioSesion', 'entidad');
                        swal('¡Bienvenido!', 'Tu Entidad Fue Registrada Exitosamente', 'success');
                        this.router.navigateByUrl('principalEntidad/entidad');
                    } else {
                        swal('¡Hecho!', 'Tu Datos Fueron Actualizados Exitosamente', 'success');
                        localStorage.setItem('nombreE', this.entidad.nombre);
                        this.router.navigateByUrl('principalEntidad/entidad');
                    }
                } else {
                    console.log(response.mensaje);
                }
                this.loading = false;
            }, error => {
                this.loading = false;
                console.log(error);
            });
    }
    /**Fin metodos registro de entidad**/

    /**
     * Limpia el campo de la contraseña de verificacion para eliminar y
     * llama la ventana emergente que contiene este campo
     */
    llamarVentana() {
        this.ventanaEliminar = document.getElementById('boton1');
        this.contraParaEliminar = document.getElementById('contraE');
        this.contraParaEliminar.value = '';
        this.ventanaEliminar.href = '#ventanaElim';
    }
    /**
     * Elimina la entidad registrada en el sistema
     */
    eliminarEntidad() {
        this.loading = true;
        this.contraParaEliminar = document.getElementById('contraE');
        this.entidadService.getEntidadByNom(this.nombreEntidad)
            .subscribe( entida => {
                this.entidadAEliminar = entida.entidad;
                if (this.entidadAEliminar.contrasena === this.contraParaEliminar.value) {
                    this.entidadService.deleteEntidad(this.entidadAEliminar.nombre)
                        .subscribe( res => {
                            this.router.navigateByUrl('');
                            swal('Hecho', 'Tu Cuenta Fue Eliminada', 'success');
                            this.loading = false;
                        });
                } else {
                    swal('Error', 'Contraseña incorrecta', 'error');
                    this.loading = false;
                }
            }, error => {
                console.log(error);
                this.loading = false;
            });
    }
    /**
     * Llama la vista para actualizar los datos de peril de la entidad
     */
    editarInfoE() {
        localStorage.setItem('verE', 'false');
        this.router.navigateByUrl('entidad/' + this.nombreE);
    }

    /**
     * Llama la vista para crear una convocatoria
     */
    editarInfoC() {
        localStorage.setItem('verC', 'false');
        this.router.navigateByUrl('convocatoriasEntidad/new');
    }
    /**
     * Carga la foto de perfil seleccionada
     * @param event del boton para agregar una foto
     */
    readUrl(event: any) {
      this.habilitarFoto = true;
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev: any) => {
                this.url = ev.target.result;
                this.entidad.foto = ev.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    /**
     * Elimina la foto que existe en el momento
     */
    eliminarFoto() {
      this.url = '../../assets/default.jpg';
      this.entidad.foto = this.url;
    }
    /**
     * Evento del input nombre que llama al metodo para actualizar la barra de progreso
     */
    animarEA() {
        if (typeof this.entidad.nombre !== 'undefined') {
            if (this.entidad.nombre.length === 1 || this.entidad.nombre.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input contrasena que llama al metodo para actualizar la barra de progreso
     */
    animarEB() {
        if (typeof this.entidad.contrasena !== 'undefined') {
            if (this.entidad.contrasena.length === 1 || this.entidad.contrasena.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input tipo que llama al metodo para actualizar la barra de progreso
     */
    animarEC(newVale) {
        this.entidad.tipo = newVale;
        if (typeof this.entidad.tipo !== 'undefined' && this.entidad.tipo !== null) {
            if (this.entidad.tipo.length >= 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input descripcion que llama al metodo para actualizar la barra de progreso
     */
    animarED() {
        if (typeof this.entidad.descripcion !== 'undefined') {
            if (this.entidad.descripcion.length === 1 || this.entidad.descripcion.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input telefono que llama al metodo para actualizar la barra de progreso
     */
    animarEE() {
        if (typeof this.entidad.telefono !== 'undefined') {
            if (this.entidad.telefono.length === 1 || this.entidad.telefono.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input direccionWeb que llama al metodo para actualizar la barra de progreso
     */
    animarEF() {
        if (typeof this.entidad.direccionWeb !== 'undefined') {
            if (this.entidad.direccionWeb.length === 1 || this.entidad.direccionWeb.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input correo que llama al metodo para actualizar la barra de progreso
     */
    animarEG() {
        if (typeof this.entidad.correo !== 'undefined') {
            if (this.entidad.correo.length === 1 || this.entidad.correo.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input facebook que llama al metodo para actualizar la barra de progreso
     */
    animarEH() {
        if (typeof this.entidad.facebook !== 'undefined') {
            if (this.entidad.facebook.length === 1 || this.entidad.facebook.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input linkedln que llama al metodo para actualizar la barra de progreso
     */
    animarEI() {
        if (typeof this.entidad.linkedln !== 'undefined') {
            if (this.entidad.linkedln.length === 1 || this.entidad.linkedln.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input twitter que llama al metodo para actualizar la barra de progreso
     */
    animarEJ() {
        if (typeof this.entidad.twitter !== 'undefined') {
            if (this.entidad.twitter.length === 1 || this.entidad.twitter.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input instagram que llama al metodo para actualizar la barra de progreso
     */
    animarEK() {
        if (typeof this.entidad.instagram !== 'undefined') {
            if (this.entidad.instagram.length === 1 || this.entidad.instagram.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input direccion que llama al metodo para actualizar la barra de progreso
     */
    animarEL() {
        if (typeof this.entidad.direccion !== 'undefined') {
            if (this.entidad.direccion.length === 1 || this.entidad.direccion.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input ciudad que llama al metodo para actualizar la barra de progreso
     */
    animarEM() {
        if (typeof this.entidad.ciudad !== 'undefined') {
            if (this.entidad.ciudad.length === 1 || this.entidad.ciudad.length === 0) {
                this.animarE();
            }
        }
    }
    /**
     * Evento del input departamento que llama al metodo para actualizar la barra de progreso
     */
    animarEN() {
        if (typeof this.entidad.departamento !== 'undefined') {
            if (this.entidad.departamento.length === 1 || this.entidad.departamento.length === 0) {
                this.animarE();
            }
        }
    }
    /**Metodo get del formulario de la entidad**/
    get foto() {
        return this.registerForm.get('foto');
    }
    get nombre() {
        return this.registerForm.get('nombre');
    }
    get contrasena() {
        return this.registerForm.get('contrasena');
    }
    get tipo() {
        return this.registerForm.get('tipo');
    }
    get descripcion() {
        return this.registerForm.get('descripcion');
    }
    get telefono() {
        return this.registerForm.get('telefono');
    }
    get direccionWeb() {
        return this.registerForm.get('direccionWeb');
    }
    get correo() {
        return this.registerForm.get('correo');
    }
    get facebook() {
        return this.registerForm.get('facebook');
    }
    get linkedln() {
        return this.registerForm.get('linkedln');
    }
    get twitter() {
        return this.registerForm.get('twitter');
    }
    get instagram() {
        return this.registerForm.get('instagram');
    }
    get direccion() {
        return this.registerForm.get('direccion');
    }
    get ciudad() {
        return this.registerForm.get('ciudad');
    }
    get departamento() {
        return this.registerForm.get('departamento');
    }
    /**Fin metodos get**/


    /**
     * Actualiza la barra de progreso de la informacion de la entidad
     * */
    animarE() {
        if (this.desabilitar === false) {
            this.camposLlenosE();
            if (this.numeroLlenosE === 0 && this.numeroLlenosLetraE !== 'cero') {
                this.numeroLlenosLetraE = 'cero';
            }if (this.numeroLlenosE === 1 && this.numeroLlenosLetraE !== 'seis') {
                this.numeroLlenosLetraE = 'seis';
                document.getElementById('progresoE').classList.toggle('seis');
            }if (this.numeroLlenosE === 2 && this.numeroLlenosLetraE !== 'doce') {
                this.numeroLlenosLetraE = 'doce';
                document.getElementById('progresoE').classList.toggle('doce');
            }if (this.numeroLlenosE === 3 && this.numeroLlenosLetraE !== 'dioc') {
                this.numeroLlenosLetraE = 'dioc';
                document.getElementById('progresoE').classList.toggle('dioc');
            }if (this.numeroLlenosE === 4 && this.numeroLlenosLetraE !== 'vecu') {
                this.numeroLlenosLetraE = 'vecu';
                document.getElementById('progresoE').classList.toggle('vecu');
            }if (this.numeroLlenosE === 5 && this.numeroLlenosLetraE !== 'trei') {
                this.numeroLlenosLetraE = 'trei';
                document.getElementById('progresoE').classList.toggle('trei');
            }if (this.numeroLlenosE === 6 && this.numeroLlenosLetraE !== 'trse') {
                this.numeroLlenosLetraE = 'trse';
                document.getElementById('progresoE').classList.toggle('trse');
            }if (this.numeroLlenosE === 7 && this.numeroLlenosLetraE !== 'cudo') {
                this.numeroLlenosLetraE = 'cudo';
                document.getElementById('progresoE').classList.toggle('cudo');
            }if (this.numeroLlenosE === 8 && this.numeroLlenosLetraE !== 'cuoc') {
                this.numeroLlenosLetraE = 'cuoc';
                document.getElementById('progresoE').classList.toggle('cuoc');
            }if (this.numeroLlenosE === 9 && this.numeroLlenosLetraE !== 'cicu') {
                this.numeroLlenosLetraE = 'cicu';
                document.getElementById('progresoE').classList.toggle('cicu');
            }if (this.numeroLlenosE === 10 && this.numeroLlenosLetraE !== 'sese') {
                this.numeroLlenosLetraE = 'sese';
                document.getElementById('progresoE').classList.toggle('sese');
            }if (this.numeroLlenosE === 11 && this.numeroLlenosLetraE !== 'seseis') {
                this.numeroLlenosLetraE = 'seseis';
                document.getElementById('progresoE').classList.toggle('seseis');
            }if (this.numeroLlenosE === 12 && this.numeroLlenosLetraE !== 'sedo') {
                this.numeroLlenosLetraE = 'sedo';
                document.getElementById('progresoE').classList.toggle('sedo');
            }if (this.numeroLlenosE === 13 && this.numeroLlenosLetraE !== 'seoc') {
                this.numeroLlenosLetraE = 'seoc';
                document.getElementById('progresoE').classList.toggle('seoc');
            }if (this.numeroLlenosE === 14 && this.numeroLlenosLetraE !== 'occu') {
                this.numeroLlenosLetraE = 'occu';
                document.getElementById('progresoE').classList.toggle('occu');
            }if (this.numeroLlenosE === 15 && this.numeroLlenosLetraE !== 'cien') {
                this.numeroLlenosLetraE = 'cien';
                document.getElementById('progresoE').classList.toggle('cien');
            }
        }
    }
    /**
     * Define cuantos campos estan llenos para actualizar la barra de progreso de la informacion de entidad
     */
    camposLlenosE() {
        this.numeroLlenosE = 0;
        if (typeof this.entidad.nombre !== 'undefined' && this.entidad.nombre !== null) {
            if (this.entidad.nombre.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.contrasena !== 'undefined' && this.entidad.contrasena !== null) {
            if (this.entidad.contrasena.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.tipo !== 'undefined' && this.entidad.tipo !== null) {
            if (this.entidad.tipo.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.descripcion !== 'undefined' && this.entidad.descripcion !== null) {
            if (this.entidad.descripcion.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.telefono !== 'undefined' && this.entidad.telefono !== null) {
            if (this.entidad.telefono.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.direccionWeb !== 'undefined' && this.entidad.direccionWeb !== null) {
            if (this.entidad.direccionWeb.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.correo !== 'undefined' && this.entidad.correo !== null) {
            if (this.entidad.correo.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.facebook !== 'undefined' && this.entidad.facebook !== null) {
            if (this.entidad.facebook.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.linkedln !== 'undefined' && this.entidad.linkedln !== null) {
            if (this.entidad.linkedln.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.twitter !== 'undefined' && this.entidad.twitter !== null) {
            if (this.entidad.twitter.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.instagram !== 'undefined' && this.entidad.instagram !== null) {
            if (this.entidad.instagram.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.direccion !== 'undefined' && this.entidad.direccion !== null) {
            if (this.entidad.direccion.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.ciudad !== 'undefined' && this.entidad.ciudad !== null) {
            if (this.entidad.ciudad.length !== 0) {
                this.numeroLlenosE++;
            }
        }if (typeof this.entidad.departamento !== 'undefined' && this.entidad.departamento !== null) {
            if (this.entidad.departamento.length !== 0) {
                this.numeroLlenosE++;
            }
        }
    }

    /**
     * Pone un mensaje en los campos que no han sido diligenciados cuando se quiere ver la informacion
     */
    llenarCamposParaVer () {
        if (typeof this.entidad.tipo === 'undefined' || this.entidad.tipo === null) {
            this.entidad.tipo = 'No ha sido deligenciado';
        }if (typeof this.entidad.telefono === 'undefined' || this.entidad.telefono === null) {
            this.entidad.telefono = 'No ha sido deligenciado';
        }if (typeof this.entidad.direccionWeb === 'undefined' || this.entidad.direccionWeb === null) {
            this.entidad.direccionWeb = 'No ha sido deligenciado';
        }if (typeof this.entidad.correo === 'undefined' || this.entidad.correo === null) {
            this.entidad.correo = 'No ha sido deligenciado';
        }if (typeof this.entidad.facebook === 'undefined' || this.entidad.facebook === null) {
            this.entidad.facebook = 'No ha sido deligenciado';
        }if (typeof this.entidad.linkedln === 'undefined' || this.entidad.linkedln === null) {
            this.entidad.linkedln = 'No ha sido deligenciado';
        }if (typeof this.entidad.twitter === 'undefined' || this.entidad.twitter === null) {
            this.entidad.twitter = 'No ha sido deligenciado';
        }if (typeof this.entidad.instagram === 'undefined' || this.entidad.instagram === null) {
            this.entidad.instagram = 'No ha sido deligenciado';
        }if (typeof this.entidad.direccion === 'undefined' || this.entidad.direccion === null) {
            this.entidad.direccion = 'No ha sido deligenciado';
        }if (typeof this.entidad.ciudad === 'undefined' || this.entidad.ciudad === null) {
            this.entidad.ciudad = 'No ha sido deligenciado';
        }if (typeof this.entidad.departamento === 'undefined' || this.entidad.departamento === null) {
            this.entidad.departamento = 'No ha sido deligenciado';
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
            this.loading = true;
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
                        this.loading = false;
                    } else {
                        console.log(response.mensaje);
                        this.loading = false;
                    }
                }, error => {
                    console.log(error);
                    this.loading = false;
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
                        }, error2 => {
                            console.log(error2);
                        });
                } else {
                    this.contraAdm.value = '';
                    swal('Error', 'La Contraseña No Coincide', 'error');
                }
                this.loading = false;
            }, error => {
                console.log(error);
                this.loading = false;
            });
    }
    /**Fin metodos gestion adm**/
}
