import { Component, OnInit } from '@angular/core';
import {StartupService} from '../services/startup.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductoService} from '../services/producto.service';
import {AdmService} from '../services/adm.service';
import {ConvocatoriaService} from '../services/convocatoria.service';
import {ConvocatoriaStartupService} from '../services/convocatoria-startup.service';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.css']
})
export class StartupComponent implements OnInit {

    startup: any = {}; /**Startup**/
    registerForm: FormGroup; /**Formulario de startup**/
    originalNombreLogeo = null; /**Nombre que se ingreso para logearse en el sistema**/
    productosLabel = ''; /**Nombre de todos los productos de la empresa en el formulario**/
    listo = false; /**Variable que habilita los campos de punto de equilibrio**/
    listoB = false; /**Variable que habilita los campos de perfil identificador**/
    mensajeRelacionamiento = false; /**Si no hay relacionamiento en los clientes de la startup esta variable cambia su valor**/
    mensajeRelacionamientoUsu = false; /**Si no hay relacionamiento en los usuarios de la startup esta variable cambia su valor**/
    a = true; b = true; c = true; d = true; e = true; f = true; g = true; /**Permiten que aparezcan los mensajes de relacionamiento**/
    h = true; i = true; j = true; /**Permiten que aparezcan los mensajes de relacionamiento**/
    mostrar = false;  /**Variable que permite mostrar el indicador**/
    minLengthPass = 6;  /**Minimo de caracteres que debe llevar la contraseña**/
    nombreStartup = null;  /**Nombre de la startup en el sistema**/
    colorMenu = true; /**Pinta el indicador dependiendo de que formulario se encuentre**/
    numeroLlenos = 0; /**Numero de campos diligenciados en el formulario de la definicion de startup**/
    numeroLlenosLetra = null; /**Numero en letra de campos diligenciados en el formulario de la definicion de startup**/
    numeroLlenosInfo = 0; /**Numero de campos diligenciados en el formulario de la informacion de startup**/
    numeroLlenosLetraInfo = null; /**Numero en letra de campos diligenciados en el formulario de la informacion de startup**/
    startupAEliminar = null; /**Strartup a eliminar**/
    ver = null; /**Variable para conocer si el usuario que ingreso a la vista es un admin o startup**/
    desabilitar = null; /**Variable para desabilitar los campos del formulario**/
    verBotonEliminar = false; /**Variable que permite ver el boton de eliminar**/
    contraParaEliminar = null; /**Contraseña que se ingresa para verificar si se elimina la entidad**/
    ventanaEliminar = null; /**Variable que representa el boton que llama la ventana emergente de eliminar**/
    todasLasStartups = null; /**Variable que representa todas las startups registradas**/
    startupCreada = 0; /**Variable que conoce si el nombre de la startup en proceso de registro ya esta registrada**/
    maxLengthInputs = 1000; /**Maxima longitud de los inputs**/
    camposFaltantes = 0; /**Variable que almacena el numero de campos de informacion que faltan por diligenciar que son requisitos**/
    camposLlenos = 0; /**Variable que almacena el numero de campos de informacion diligenciados que son requisitos**/
    /**Atributos para el formulario de aplicar a una convocatoria**/
    aplicarForm: FormGroup; /**Formulario de las startups que aplican o pueden aplicar a una convocatoria**/
    convocatoria_startup: any = {}; /**Startup que aplico o puede aplicar a una convocatoria**/
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
     * Metodo constructor donde se conoce si el usuario que ingreso a la vista es un admin o startup para desabilitar los campos
     * @param {StartupService} startupService servicios de startup
     * @param {Router} router perimite redirigiise a otra vista
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {ProductoService} productoService servicios de producto
     * @param {AdmService} admService servicios de administrador
     * @param {ConvocatoriaService} convocatoriaService servicios de convocatoria
     * @param {ConvocatoriaStartupService} convocatoria_startupService servicios de la relacion entre startup y convocatoria
     */
    constructor(private startupService: StartupService, private  router: Router, private admService: AdmService,
                private routerUrl: ActivatedRoute, private productoService: ProductoService,
                private convocatoriaService: ConvocatoriaService, private convocatoria_startupService: ConvocatoriaStartupService) {
        this.nombreStartup = routerUrl.snapshot.params['nombre'];
        this.correoAdm = localStorage.getItem('correo');
        this.ver = localStorage.getItem('ver');
        this.originalNombreLogeo = localStorage.getItem('nombre');
        if (this.ver === 'false' && this.nombreStartup !== 'new' ) {
            if (this.nombreStartup !== this.originalNombreLogeo) {
                swal('Lo sentimos!', 'No tienes permiso para entrar aqui', 'error');
                this.router.navigateByUrl('');
            }
        }
        if (this.ver === 'true') {
            this.desabilitar = true;
        } else {
            this.desabilitar = false;
        }if (this.nombreStartup !== 'new') {
            this.verBotonEliminar = true;
        } else {
            this.verBotonEliminar = false;
        }
    }

    /**
     * Carga los datos de la startup si se quiere actualizar y crea su formulario
     */
  ngOnInit() {
      if (this.nombreStartup !== 'new') {
        this.loading = true;
          this.startupService.getStartupByNom(this.nombreStartup)
              .subscribe(response => {
                  if (response.codigo.toString() === '200') {
                      this.startup = response.startup;
                      this.animar();
                      this.animarInfo();
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
      } else {
          this.mostrar = false;
      }
      this.registerForm = new FormGroup({
          'nombre': new FormControl(this.startup.nombre, [
              Validators.required,
              Validators.maxLength(this.maxLengthInputs)
          ]),
          'contrasena': new FormControl(this.startup.contrasena, [
              Validators.required,
              Validators.minLength(this.minLengthPass),
              Validators.maxLength(20)
          ]),
          'sector': new FormControl(this.startup.sector, [
              Validators.required
          ]),
          'intension': new FormControl(this.startup.intension, [
              Validators.required,
              Validators.maxLength(this.maxLengthInputs)
          ]),
          'nomina': new FormControl(this.startup.nomina, [
              Validators.pattern('[0-9]*'),
              Validators.maxLength(255)
          ]),
          'prestacion': new FormControl(this.startup.prestacion, [
              Validators.pattern('[0-9]*'),
              Validators.maxLength(255)
          ]),
          'puntoEquilibrio': new FormControl(this.startup.puntoEquilibrio, []),
          'estrategia': new FormControl(this.startup.estrategia, [Validators.maxLength(this.maxLengthInputs)]),
          'tiempoMeta': new FormControl(this.startup.tiempoMeta, [Validators.maxLength(this.maxLengthInputs)]),
          'personaContacto': new FormControl(this.startup.personaContacto, [Validators.maxLength(this.maxLengthInputs)]),
          'correoContacto': new FormControl(this.startup.correoContacto, [Validators.maxLength(50)]),
          'telefonoContacto': new FormControl(this.startup.telefonoContacto, [
              Validators.pattern('[0-9]*'),
              Validators.maxLength(20)
          ]),
          'perfilIdentificador': new FormControl(this.startup.perfilIdentificador, []),
          'nombreEncargado': new FormControl(this.startup.nombreEncargado, [Validators.maxLength(this.maxLengthInputs)]),
          'correoEncargado': new FormControl(this.startup.correoEncargado, [Validators.maxLength(50)]),
          'telefonoEncargado': new FormControl(this.startup.telefonoContacto, [
              Validators.pattern('[0-9]*'),
              Validators.maxLength(20)
          ]),
          'segmentoCli': new FormControl(this.startup.segmentoCli, [Validators.maxLength(this.maxLengthInputs)]),
          'propuestaCli': new FormControl(this.startup.propuestaCli, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesInfoCli': new FormControl(this.startup.canalesInfoCli, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesEvaCli': new FormControl(this.startup.canalesEvaCli, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesVentaCli': new FormControl(this.startup.canalesVentaCli, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesEntregaCli': new FormControl(this.startup.canalesEntregaCli, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesPosVentaCli': new FormControl(this.startup.canalesPosVentaCli, [Validators.maxLength(this.maxLengthInputs)]),
          'segmentoUsu': new FormControl(this.startup.segmentoUsu, [Validators.maxLength(this.maxLengthInputs)]),
          'propuestaUsu': new FormControl(this.startup.propuestaUsu, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesInfoUsu': new FormControl(this.startup.canalesInfoUsu, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesEvaUsu': new FormControl(this.startup.canalesEvaUsu, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesVentaUsu': new FormControl(this.startup.canalesVentaUsu, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesEntregaUsu': new FormControl(this.startup.canalesEntregaUsu, [Validators.maxLength(this.maxLengthInputs)]),
          'canalesPosVentaUsu': new FormControl(this.startup.canalesPosVentaUsu, [Validators.maxLength(this.maxLengthInputs)]),
          'personalCli': new FormControl(this.startup.personalCli, []),
          'personalDedicadoCli': new FormControl(this.startup.personalDedicadoCli, []),
          'autoservicioCli': new FormControl(this.startup.autoservicioUsu, []),
          'automatizadoCli': new FormControl(this.startup.automatizadoCli, []),
          'comunidadesCli': new FormControl(this.startup.comunidadesCli, []),
          'personalUsu': new FormControl(this.startup.personalUsu, []),
          'personalDedicadoUsu': new FormControl(this.startup.personalDedicadoUsu, []),
          'autoservicioUsu': new FormControl(this.startup.autoservicioUsu, []),
          'automatizadoUsu': new FormControl(this.startup.automatizadoUsu, []),
          'comunidadesUsu': new FormControl(this.startup.comunidadesUsu, []),
          'nombreProceso': new FormControl(this.startup.nombreProceso, [Validators.maxLength(this.maxLengthInputs)]),
          'perspectivaUsuario': new FormControl(this.startup.perspectivaUsuario, [Validators.maxLength(this.maxLengthInputs)]),
          'perspectivaEmpresa': new FormControl(this.startup.perspectivaEmpresa, [Validators.maxLength(this.maxLengthInputs)]),
          'objetivoProceso': new FormControl(this.startup.objetivoProceso, [Validators.maxLength(this.maxLengthInputs)]),
          'descripcionProceso': new FormControl(this.startup.descripcionProceso, [Validators.maxLength(this.maxLengthInputs)])
      });
      this.aplicarForm = new FormGroup({
          'convocatoriaApli': new FormControl(this.convocatoria_startup.convocatoriaApli, []),
          'startupApli': new FormControl(this.convocatoria_startup.startupApli, []),
          'aplico': new FormControl(this.convocatoria_startup.aplico, []),
          'porcentaje': new FormControl(this.convocatoria_startup.porcentaje, []),
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
  }
  /**Metodos para registrar una entidad**/

    /**
     * Evento del boton agregar
     * Conoce si el nombre de la startup ya esta registrado y
     * llama al metodo que responde la solicitud de registro
     */
    aceptar() {
        if (!this.registerForm.valid || this.desabilitar) {
            swal('ERROR', 'No es posible guardar los datos', 'error');
        } else {
            this.loading = true;
            this.volverNullCheck();
            this.startupService.getStartups().subscribe(todas => {
                this.startupCreada = 0;
                this.todasLasStartups = todas.startups;
                if (this.todasLasStartups !== null) {
                    this.todasLasStartups.forEach(el => {
                        if (el.nombre.toUpperCase() === this.startup.nombre.toUpperCase()) {
                            this.startupCreada++;
                        }
                    });
                }
                this.crearOActualizar();
            }, error2 => {
                console.log(error2);
                this.loading = false;
            });
        }
    }
    /**
     * Responde si la startup ya fue creada o llama al metodo
     * que realiza la consulta de registro
     */
    crearOActualizar() {
        if (this.nombreStartup === 'new') {
            if (this.startupCreada === 0) {
                this.consultaSave();
            } else {
                this.loading = false;
                swal('¡ERROR!', 'El Nombre De La Startup Ya Se Encuentra Registrado', 'error');
            }
        } else {
            this.consultaSave();
        }
    }
    /**
     * Consulta para agregar o actualizar una startup
     */
    consultaSave() {
        this.startupService.saveStartup(this.startup).subscribe(
            response => {
                if (response.codigo.toString() === '200') {
                    this.relacionStartupsConv();
                    if (this.nombreStartup === 'new') {
                        localStorage.setItem('nombre', this.startup.nombre);
                        localStorage.setItem('usuarioSesion', 'startup');
                        swal('¡Bienvenido!', 'Tu Startup Fue Registrada Exitosamente', 'success');
                        this.router.navigateByUrl('principalStartup/startup');
                    } else {
                        swal('¡Hecho!', 'Tus Datos Fueron Actualizados Exitosamente', 'success');
                        localStorage.setItem('nombre', this.startup.nombre);
                        this.router.navigateByUrl('principalStartup/startup');
                    }
                    this.loading = false;
                } else {
                    this.loading = false;
                    console.log(response.mensaje);
                }
            }, error => {
                this.loading = false;
                console.log(error);
            });
    }

    /**
     * Crea la relacion entre las startups y la convocatoria creada
     */
    relacionStartupsConv() {
        this.convocatoriaService.getConvocatorias().subscribe(todas => {
           todas.convocatorias.forEach(elemento => {
               if (elemento.estado === 'Abierta') {
                   this.convocatoria_startup.aplico = 'false';
                   this.convocatoriaService.getConvocatoriaByNom(elemento.nombre).subscribe(miConv => {
                       this.convocatoria_startup.convocatoriaApli = miConv.convocatoria;
                       this.convocatoria_startup.startupApli = this.startup;
                       this.porcentajeFaltante(this.convocatoria_startup.startupApli, this.convocatoria_startup.convocatoriaApli);
                   }, error2 => {
                       console.log(error2);
                   });
               }
           });
        }, error2 => {
            console.log(error2);
        });
    }

    /**
     * Conoce que startups pueden aplicar o no
     * @param startup a verificar si aplica para la convocatoria
     * @returns true si saplica o false si no
     */
    porcentajeFaltante(startup, convocatoria) {
        this.camposFaltantes = 0;
        this.camposLlenos = 0;
        if (convocatoria.requisitos.perCon === true) {
            if (typeof startup.personaContacto === 'undefined' || startup.personaContacto === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.corCon === true) {
            if (typeof startup.correoContacto === 'undefined' || startup.correoContacto === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.telCon === true) {
            if (typeof startup.telefonoContacto === 'undefined' || startup.telefonoContacto === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.est === true) {
            if (typeof startup.estrategia === 'undefined' || startup.estrategia === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.tieMet === true) {
            if (typeof startup.tiempoMeta === 'undefined' || startup.tiempoMeta === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.nomEnc === true) {
            if (typeof startup.nombreEncargado === 'undefined' || startup.nombreEncargado === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.corEnc === true) {
            if (typeof startup.correoEncargado === 'undefined' || startup.correoEncargado === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.telEnc === true) {
            if (typeof startup.telefonoEncargado === 'undefined' || startup.telefonoEncargado === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.segMerCli === true) {
            if (typeof startup.segmentoCli === 'undefined' || startup.segmentoCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.segMerUsu === true) {
            if (typeof startup.segmentoUsu === 'undefined' || startup.segmentoUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.proValCli === true) {
            if (typeof startup.propuestaCli === 'undefined' || startup.propuestaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.proValUsu === true) {
            if (typeof startup.propuestaUsu === 'undefined' || startup.propuestaUsu === null) {
                this.camposFaltantes++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canInfCli === true) {
            if (typeof startup.canalesInfoCli === 'undefined' || startup.canalesInfoCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canInfUsu === true) {
            if (typeof startup.canalesInfoUsu === 'undefined' || startup.canalesInfoUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canEvaCli === true) {
            if (typeof startup.canalesEvaCli === 'undefined' || startup.canalesEvaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canEvaUsu === true) {
            if (typeof startup.canalesEvaUsu === 'undefined' || startup.canalesEvaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canVenCli === true) {
            if (typeof startup.canalesVentaCli === 'undefined' || startup.canalesVentaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canVenUsu === true) {
            if (typeof startup.canalesVentaUsu === 'undefined' || startup.canalesVentaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canEntCli === true) {
            if (typeof startup.canalesEntregaCli === 'undefined' || startup.canalesEntregaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canEntUsu === true) {
            if (typeof startup.canalesEntregaUsu === 'undefined' || startup.canalesEntregaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canPosCli === true) {
            if (typeof startup.canalesPosVentaCli === 'undefined' || startup.canalesPosVentaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.canPosUsu === true) {
            if (typeof startup.canalesPosVentaUsu === 'undefined' || startup.canalesPosVentaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.nomPro === true) {
            if (typeof startup.nombreProceso === 'undefined' || startup.nombreProceso === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.objPro === true) {
            if (typeof startup.objetivoProceso === 'undefined' || startup.objetivoProceso === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.desPro === true) {
            if (typeof startup.descripcionProceso === 'undefined' || startup.descripcionProceso === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.metProCli === true) {
            if (typeof startup.perspectivaEmpresa === 'undefined' || startup.perspectivaEmpresa === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (convocatoria.requisitos.metProUsu === true) {
            if (typeof startup.perspectivaUsuario === 'undefined' || startup.perspectivaUsuario === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        this.relacionamientoCli(startup, convocatoria);
        this.relacionamientoUsu(startup, convocatoria);
        this.empleadosNom(startup, convocatoria);
        this.empleadosPre(startup, convocatoria);
        this.convocatoria_startup.porcentaje = ((this.camposFaltantes * 100) / (this.camposLlenos + this.camposFaltantes));
        this.startupService.getStartupByNom(this.startup.nombre).subscribe(st => {
           this.convocatoria_startup.startupApli = st.startup;
            this.convocatoria_startupService.saveConvocatoria_startup(this.convocatoria_startup)
                .subscribe(relacion => {
                    if (relacion.codigo === '200') {
                        this.convocatoria_startup.convocatoriaApli.cantidadPuedenAplicar ++;
                        this.convocatoriaService.saveConvocatoria(this.convocatoria_startup).subscribe(resu => {
                            console.log('Relacion creada exitosamente');
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

    /**Metodos de verificacion cuando una startup aplica a una convocatoria**/

    /**
     * Comprueba si el campo relacionamiento cliente tiene algun dato
     * para ver si es un dato que falta o ya esta diligenciado
     * @param startup a verificar si aplica para la convocatoria
     */
    relacionamientoCli(startup, convocatoria) {
        if (convocatoria.requisitos.relCli === true) {
            if (startup.personalCli === true || startup.autoservicioCli === true
                || startup.automatizadoCli === true || startup.comunidadesCli === true || startup.personalDedicadoCli === true) {
                this.camposLlenos ++;
            } else {
                this.camposFaltantes ++;
            }
        }
    }
    /**
     * Comprueba si el campo relacionamiento usuario tiene algun dato
     * para ver si es un dato que falta o ya esta diligenciado
     * @param startup a verificar si aplica para la convocatoria
     */
    relacionamientoUsu(startup, convocatoria) {
        if (convocatoria.requisitos.relUsu === true) {
            if (startup.personalUsu === true || startup.autoservicioUsu === true
                || startup.automatizadoUsu === true || startup.comunidadesUsu === true || startup.personalDedicadoUsu === true) {
                this.camposLlenos ++;
            } else {
                this.camposFaltantes ++;
            }
        }
    }
    /**
     * Comprueba si los empleados de nomina son iguales o mayores a los requeridos
     * para ver si es un dato que falta o ya esta diligenciado
     * @param startup a verificar si aplica para la convocatoria
     */
    empleadosNom(startup, convocatoria) {
        if (typeof convocatoria.requisitos.empNom !== 'undefined' && convocatoria.requisitos.empNom !== null &&
            convocatoria.requisitos.empNom !== '') {
            if (typeof startup.nomina === 'undefined' || startup.nomina === null || startup.nomina === '') {
                this.camposFaltantes ++;
            } else if (Number(convocatoria.requisitos.empNom) > Number(startup.nomina)) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
    }
    /**
     * Comprueba si los empleados de prestacion son iguales o mayores a los requeridos
     * para ver si es un dato que falta o ya esta diligenciado
     * @param startup a verificar si aplica para la convocatoria
     */
    empleadosPre(startup, convocatoria) {
        if (typeof convocatoria.requisitos.empPre !== 'undefined' && convocatoria.requisitos.empPre !== null &&
            convocatoria.requisitos.empPre !== '') {
            if (typeof startup.prestacion === 'undefined' || startup.prestacion === null || startup.prestacion === '') {
                this.camposFaltantes ++;
            } else if (Number(convocatoria.requisitos.empPre) > Number(startup.prestacion)) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
    }
    /**Fin metodos de verificacion cuando una startup puede aplicar a una convocatoria**/

    /**
     * Si un checkbox es falso lo vuelve nulo para poder deseleccionarlo
     */
    volverNullCheck() {
        if (this.startup.personalCli === false) {
            this.startup.personalCli = null;
        }if (this.startup.autoservicioCli === false) {
            this.startup.autoservicioCli = null;
        }if (this.startup.automatizadoCli === false) {
            this.startup.automatizadoCli = null;
        }if (this.startup.comunidadesCli === false) {
            this.startup.comunidadesCli = null;
        }if (this.startup.personalDedicadoCli === false) {
            this.startup.personalDedicadoCli = null;
        }if (this.startup.personalUsu === false) {
            this.startup.personalUsu = null;
        }if (this.startup.autoservicioUsu === false) {
            this.startup.autoservicioUsu = null;
        }if (this.startup.automatizadoUsu === false) {
            this.startup.automatizadoUsu = null;
        }if (this.startup.comunidadesUsu === false) {
            this.startup.comunidadesUsu = null;
        }if (this.startup.personalDedicadoUsu === false) {
            this.startup.personalDedicadoUsu = null;
        }
    }
    /**Fin metodos registro de startup**/

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
     * Cambia las variables que modifican el color del indicador y
     * que muestra el formulario de la definicion de startup
     */
    volver() {
        this.mostrar = false;
        this.colorMenu = true;
    }
    /**
     * Cambia las variables que modifican el color del indicador y
     * que muestra el formulario de la informacion de startup
     */
    siguiente() {
        this.colorMenu = false;
        this.mostrar = true;
    }
    /**
     * Limpia el campo de la contraseña de verificacion para eliminar y
     * llama la ventana emergente que contiene este campo
     */
    llamarVentana() {
        this.ventanaEliminar = document.getElementById('boton');
        this.contraParaEliminar = document.getElementById('contra');
        this.contraParaEliminar.value = '';
        this.ventanaEliminar.href = '#ventanaElim';
    }
    /**
     * Elimina la startup registrada en el sistema
     */
    eliminarStartup() {
        this.loading = true;
        this.contraParaEliminar = document.getElementById('contra');
        this.startupService.getStartupByNom(this.nombreStartup)
            .subscribe( startu => {
                this.startupAEliminar = startu.startup;
                if (this.startupAEliminar.contrasena === this.contraParaEliminar.value) {
                    this.startupService.deleteStartup(this.startupAEliminar.nombre)
                        .subscribe( res => {
                            this.router.navigateByUrl('');
                            swal('Hecho', 'Tu Cuenta Fue Eliminada', 'success');
                            this.loading = false;
                        });
                } else {
                    this.loading = false;
                    swal('Error', 'Contraseña incorrecta', 'error');
                }
            }, error => {
                this.loading = false;
                console.log(error);
            });
    }
    /**
     * Llama la vista para actualizar los datos de peril de la startup
     */
    editarInfo() {
        localStorage.setItem('ver', 'false');
        this.router.navigateByUrl('startup/' + this.startup.nombre);
    }
    /**
     * Llama la vista para crear una producto
     */
    editarInfoP() {
        localStorage.setItem('verP', 'false');
        this.router.navigateByUrl('productosStartup/new');
    }

    /**
     * Evento del select puntoEquilibrio que llama al metodo para actualizar la barra de progreso
     */
    habilitarPuntoEquilibrio(newValue) {
        this.startup.puntoEquilibrio = newValue;
        if (typeof this.startup.puntoEquilibrio !== 'undefined' && this.startup.puntoEquilibrio !== null) {
            if (this.startup.puntoEquilibrio === 'Si') {
                this.startup.estrategia = '';
                this.startup.tiempoMeta = '';
                this.startup.personaContacto = '';
                this.startup.correoContacto = '';
                this.startup.telefonoContacto = '';
                this.listo = false;
            }
            if (this.startup.puntoEquilibrio !== null) {
                if (this.startup.puntoEquilibrio === 'No') {
                    this.listo = true;
                }if (this.startup.puntoEquilibrio.length >= 0) {
                    this.animar();
                }
            }
        }
    }
    /**
     * Evento del input perfilIdentificador que llama al metodo para actualizar la barra de progreso
     */
    habilitarPerfilIdentificador(newValue) {
        this.startup.perfilIdentificador = newValue;
        if (typeof this.startup.perfilIdentificador !== 'undefined' && this.startup.perfilIdentificador !== null) {
            if (this.startup.perfilIdentificador === 'No') {
                this.startup.nombreEncargado = '';
                this.startup.correoEncargado = '';
                this.startup.telefonoEncargado = '';
                this.listoB = false;
            }
            if (this.startup.puntoEquilibrio !== null) {
                if (this.startup.perfilIdentificador === 'Si') {
                    this.listoB = true;
                }if (this.startup.perfilIdentificador.length >= 0) {
                    this.animar();
                }
            }
        }
    }
    /**
     * Evento del input nombre que llama al metodo para actualizar la barra de progreso
     */
    animarA() {
        if (typeof this.startup.nombre !== 'undefined') {
            if (this.startup.nombre.length === 1 || this.startup.nombre.length === 0) {
                this.animar();
            }
        }
    }
    /**
     * Evento del input contrasena que llama al metodo para actualizar la barra de progreso
     */
    animarB() {
        if (typeof this.startup.contrasena !== 'undefined') {
            if (this.startup.contrasena.length === 1 || this.startup.contrasena.length === 0) {
                this.animar();
            }
        }
    }

    /**
     * Evento del select sector que llama al metodo para actualizar la barra de progreso
     * @param newVale del select
     */
    animarC(newVale) {
        this.startup.sector = newVale;
        if (typeof this.startup.sector !== 'undefined') {
            if (this.startup.sector.length >= 0) {
                this.animar();
            }
        }
    }
    /**
     * Evento del input intension que llama al metodo para actualizar la barra de progreso
     */
    animarE() {
        if (typeof this.startup.intension !== 'undefined') {
            if (this.startup.intension.length === 1 || this.startup.intension.length === 0) {
                this.animar();
            }
        }
    }
    /**
     * Evento del input nomina que llama al metodo para actualizar la barra de progreso
     */
    animarF() {
        if (typeof this.startup.nomina !== 'undefined') {
            if (this.startup.nomina.length === 1 || this.startup.nomina.length === 0) {
                this.animar();
            }
        }
    }
    /**
     * Evento del input prestacion que llama al metodo para actualizar la barra de progreso
     */
    animarG() {
        if (typeof this.startup.prestacion !== 'undefined') {
            if (this.startup.prestacion.length === 1 || this.startup.prestacion.length === 0) {
                this.animar();
            }
        }
    }
    /**
     * Evento del input estrategia que llama al metodo para actualizar la barra de progreso
     */
    animarI() {
        if (typeof this.startup.estrategia !== 'undefined') {
            if (this.startup.estrategia.length === 1 || this.startup.estrategia.length === 0) {
                this.animar();
            }
            if (typeof this.startup.puntoEquilibrio === 'undefined' || this.startup.puntoEquilibrio === null) {
                this.startup.puntoEquilibrio = 'No';
                this.listo = true;
            }
        }
    }
    /**
     * Evento del input tiempoMeta que llama al metodo para actualizar la barra de progreso
     */
    animarJ() {
        if (typeof this.startup.tiempoMeta !== 'undefined') {
            if (this.startup.tiempoMeta.length === 1 || this.startup.tiempoMeta.length === 0) {
                this.animar();
            }
            if (typeof this.startup.puntoEquilibrio === 'undefined' || this.startup.puntoEquilibrio === null) {
                this.startup.puntoEquilibrio = 'No';
                this.listo = true;
            }
        }
    }
    /**
     * Evento del input personaContacto que llama al metodo para actualizar la barra de progreso
     */
    animarK() {
        if (typeof this.startup.personaContacto !== 'undefined') {
            if (this.startup.personaContacto.length === 1 || this.startup.personaContacto.length === 0) {
                this.animar();
            }
            if (typeof this.startup.puntoEquilibrio === 'undefined' || this.startup.puntoEquilibrio === null) {
                this.startup.puntoEquilibrio = 'No';
                this.listo = true;
            }
        }
    }
    /**
     * Evento del input correoContacto que llama al metodo para actualizar la barra de progreso
     */
    animarL() {
        if (typeof this.startup.correoContacto !== 'undefined') {
            if (this.startup.correoContacto.length === 1 || this.startup.correoContacto.length === 0) {
                this.animar();
            }
        }
        if (typeof this.startup.puntoEquilibrio === 'undefined' || this.startup.puntoEquilibrio === null) {
            this.startup.puntoEquilibrio = 'No';
            this.listo = true;
        }
    }
    /**
     * Evento del input telefonoContacto que llama al metodo para actualizar la barra de progreso
     */
    animarM() {
        if (typeof this.startup.telefonoContacto !== 'undefined') {
            if (this.startup.telefonoContacto.length === 1 || this.startup.telefonoContacto.length === 0) {
                this.animar();
            }
        }
        if (typeof this.startup.puntoEquilibrio === 'undefined' || this.startup.puntoEquilibrio === null) {
            this.startup.puntoEquilibrio = 'No';
            this.listo = true;
        }
    }
    /**
     * Evento del input nombreEncargado que llama al metodo para actualizar la barra de progreso
     */
    animarO() {
        if (typeof this.startup.nombreEncargado !== 'undefined') {
            if (this.startup.nombreEncargado.length === 1 || this.startup.nombreEncargado.length === 0) {
                this.animar();
            }
        }
        if (typeof this.startup.perfilIdentificador === 'undefined' || this.startup.perfilIdentificador === null) {
            this.startup.perfilIdentificador = 'Si';
            this.listoB = true;
        }
    }
    /**
     * Evento del input correoEncargado que llama al metodo para actualizar la barra de progreso
     */
    animarP() {
        if (typeof this.startup.correoEncargado !== 'undefined') {
            if (this.startup.correoEncargado.length === 1 || this.startup.correoEncargado.length === 0) {
                this.animar();
            }
        }
        if (typeof this.startup.perfilIdentificador === 'undefined' || this.startup.perfilIdentificador === null) {
            this.startup.perfilIdentificador = 'Si';
            this.listoB = true;
        }
    }
    /**
     * Evento del input telefonoEncargado que llama al metodo para actualizar la barra de progreso
     */
    animarQ() {
        if (typeof this.startup.telefonoEncargado !== 'undefined') {
            if (this.startup.telefonoEncargado.length === 1 || this.startup.telefonoEncargado.length === 0) {
                this.animar();
            }
        }
        if (typeof this.startup.perfilIdentificador === 'undefined' || this.startup.perfilIdentificador === null) {
            this.startup.perfilIdentificador = 'Si';
            this.listoB = true;
        }
    }

    /**
     * Evento del input segmentoCli que llama al metodo para actualizar la barra de progreso
     */
    animarDosA() {
        if (typeof this.startup.segmentoCli !== 'undefined') {
            if (this.startup.segmentoCli.length === 1 || this.startup.segmentoCli.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input propuestaCli que llama al metodo para actualizar la barra de progreso
     */
    animarDosB() {
        if (typeof this.startup.propuestaCli !== 'undefined') {
            if (this.startup.propuestaCli.length === 1 || this.startup.propuestaCli.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesInfoCli que llama al metodo para actualizar la barra de progreso
     */
    animarDosC() {
        if (typeof this.startup.canalesInfoCli !== 'undefined') {
            if (this.startup.canalesInfoCli.length === 1 || this.startup.canalesInfoCli.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesEvaCli que llama al metodo para actualizar la barra de progreso
     */
    animarDosD() {
        if (typeof this.startup.canalesEvaCli !== 'undefined') {
            if (this.startup.canalesEvaCli.length === 1 || this.startup.canalesEvaCli.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesVentaCli que llama al metodo para actualizar la barra de progreso
     */
    animarDosE() {
        if (typeof this.startup.canalesVentaCli !== 'undefined') {
            if (this.startup.canalesVentaCli.length === 1 || this.startup.canalesVentaCli.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesEntregaCli que llama al metodo para actualizar la barra de progreso
     */
    animarDosF() {
        if (typeof this.startup.canalesEntregaCli !== 'undefined') {
            if (this.startup.canalesEntregaCli.length === 1 || this.startup.canalesEntregaCli.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesPosVentaCli que llama al metodo para actualizar la barra de progreso
     */
    animarDosG() {
        if (typeof this.startup.canalesPosVentaCli !== 'undefined') {
            if (this.startup.canalesPosVentaCli.length === 1 || this.startup.canalesPosVentaCli.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input segmentoUsu que llama al metodo para actualizar la barra de progreso
     */
    animarDosH() {
        if (typeof this.startup.segmentoUsu !== 'undefined') {
            if (this.startup.segmentoUsu.length === 1 || this.startup.segmentoUsu.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input propuestaUsu que llama al metodo para actualizar la barra de progreso
     */
    animarDosI() {
        if (typeof this.startup.propuestaUsu !== 'undefined') {
            if (this.startup.propuestaUsu.length === 1 || this.startup.propuestaUsu.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesInfoUsu que llama al metodo para actualizar la barra de progreso
     */
    animarDosJ() {
        if (typeof this.startup.canalesInfoUsu !== 'undefined') {
            if (this.startup.canalesInfoUsu.length === 1 || this.startup.canalesInfoUsu.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesEvaUsu que llama al metodo para actualizar la barra de progreso
     */
    animarDosK() {
        if (typeof this.startup.canalesEvaUsu !== 'undefined') {
            if (this.startup.canalesEvaUsu.length === 1 || this.startup.canalesEvaUsu.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesVentaUsu que llama al metodo para actualizar la barra de progreso
     */
    animarDosL() {
        if (typeof this.startup.canalesVentaUsu !== 'undefined') {
            if (this.startup.canalesVentaUsu.length === 1 || this.startup.canalesVentaUsu.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesEntregaUsu que llama al metodo para actualizar la barra de progreso
     */
    animarDosM() {
        if (typeof this.startup.canalesEntregaUsu !== 'undefined') {
            if (this.startup.canalesEntregaUsu.length === 1 || this.startup.canalesEntregaUsu.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input canalesPosVentaUsu que llama al metodo para actualizar la barra de progreso
     */
    animarDosN() {
        if (typeof this.startup.canalesPosVentaUsu !== 'undefined') {
            if (this.startup.canalesPosVentaUsu.length === 1 || this.startup.canalesPosVentaUsu.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input nombreProceso que llama al metodo para actualizar la barra de progreso
     */
    animarDosO() {
        if (typeof this.startup.nombreProceso !== 'undefined') {
            if (this.startup.nombreProceso.length === 1 || this.startup.nombreProceso.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input perspectivaUsuario que llama al metodo para actualizar la barra de progreso
     */
    animarDosP() {
        if (typeof this.startup.perspectivaUsuario !== 'undefined') {
            if (this.startup.perspectivaUsuario.length === 1 || this.startup.perspectivaUsuario.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input perspectivaEmpresa que llama al metodo para actualizar la barra de progreso
     */
    animarDosQ() {
        if (typeof this.startup.perspectivaEmpresa !== 'undefined') {
            if (this.startup.perspectivaEmpresa.length === 1 || this.startup.perspectivaEmpresa.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input objetivoProceso que llama al metodo para actualizar la barra de progreso
     */
    animarDosR() {
        if (typeof this.startup.objetivoProceso !== 'undefined') {
            if (this.startup.objetivoProceso.length === 1 || this.startup.objetivoProceso.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**
     * Evento del input descripcionProceso que llama al metodo para actualizar la barra de progreso
     */
    animarDosS() {
        if (typeof this.startup.descripcionProceso !== 'undefined') {
            if (this.startup.descripcionProceso.length === 1 || this.startup.descripcionProceso.length === 0) {
                this.animarInfo();
            }
        }
    }
    /**Metodos get**/
    get nombre() {
        return this.registerForm.get('nombre');
    }
    get contrasena() {
        return this.registerForm.get('contrasena');
    }
    get sector() {
        return this.registerForm.get('sector');
    }
    get intension() {
        return this.registerForm.get('intension');
    }
    get nomina() {
        return this.registerForm.get('nomina');
    }
    get prestacion() {
        return this.registerForm.get('prestacion');
    }
    get puntoEquilibrio() {
        return this.registerForm.get('puntoEquilibrio');
    }
    get estrategia() {
        return this.registerForm.get('estrategia');
    }
    get tiempoMeta() {
        return this.registerForm.get('tiempoMeta');
    }
    get personaContacto() {
        return this.registerForm.get('personaContacto');
    }
    get correoContacto() {
        return this.registerForm.get('correoContacto');
    }
    get telefonoContacto() {
        return this.registerForm.get('telefonoContacto');
    }
    get perfilIdentificador() {
        return this.registerForm.get('perfilIdentificador');
    }
    get nombreEncargado() {
        return this.registerForm.get('nombreEncargado');
    }
    get correoEncargado() {
        return this.registerForm.get('correoEncargado');
    }
    get telefonoEncargado() {
        return this.registerForm.get('telefonoEncargado');
    }
    get segmentoCli() {
        return this.registerForm.get('segmentoCli');
    }
    get propuestaCli() {
        return this.registerForm.get('propuestaCli');
    }
    get canalesInfoCli() {
        return this.registerForm.get('canalesInfoCli');
    }
    get canalesEvaCli() {
        return this.registerForm.get('canalesEvaCli');
    }
    get canalesVentaCli() {
        return this.registerForm.get('canalesVentaCli');
    }
    get canalesEntregaCli() {
        return this.registerForm.get('canalesEntregaCli');
    }
    get canalesPosVentaCli() {
        return this.registerForm.get('canalesPosVentaCli');
    }
    get segmentoUsu() {
        return this.registerForm.get('segmentoCli');
    }
    get propuestaUsu() {
        return this.registerForm.get('propuestaCli');
    }
    get canalesInfoUsu() {
        return this.registerForm.get('canalesInfoCli');
    }
    get canalesEvaUsu() {
        return this.registerForm.get('canalesEvaCli');
    }
    get canalesVentaUsu() {
        return this.registerForm.get('canalesVentaCli');
    }
    get canalesEntregaUsu() {
        return this.registerForm.get('canalesEntregaCli');
    }
    get canalesPosVentaUsu() {
        return this.registerForm.get('canalesPosVentaCli');
    }
    get personalCli() {
        return this.registerForm.get('personalCli');
    }
    get personalUsu() {
        return this.registerForm.get('personalUsu');
    }
    get personalDedicadoCli() {
        return this.registerForm.get('personalDedicadoCli');
    }
    get personalDedicadoUsu() {
        return this.registerForm.get('personalDedicadoUsu');
    }
    get autoservicioCli() {
        return this.registerForm.get('autoservicioCli');
    }
    get autoservicioUsu() {
        return this.registerForm.get('autoservicioUsu');
    }
    get automatizadoCli() {
        return this.registerForm.get('automatizadoCli');
    }
    get automatizadoUsu() {
        return this.registerForm.get('automatizadoUsu');
    }
    get comunidadesCli() {
        return this.registerForm.get('comunidadesCli');
    }
    get comunidadesUsu() {
        return this.registerForm.get('comunidadesUsu');
    }
    get nombreProceso() {
        return this.registerForm.get('nombreProceso');
    }
    get perspectivaUsuario() {
        return this.registerForm.get('perspectivaUsuario');
    }
    get perspectivaEmpresa() {
        return this.registerForm.get('perspectivaEmpresa');
    }
    get objetivoProceso() {
        return this.registerForm.get('objetivoProceso');
    }
    get descripcionProceso() {
        return this.registerForm.get('descripcionProceso');
    }

    /**
     * Actualiza la barra de progreso
     * */
    animar() {
        if (this.desabilitar === false) {
            this.camposLlenosP();
            if (this.listo === false && this.listoB === false) {
                if ((this.numeroLlenos === 0 || this.numeroLlenos === 1) && this.numeroLlenosLetra !== 'cero') {
                    this.numeroLlenosLetra = 'cero';
                }if ((this.numeroLlenos === 2 || this.numeroLlenos === 3) && this.numeroLlenosLetra !== 'vecu') {
                    this.numeroLlenosLetra = 'vecu';
                    document.getElementById('progreso').classList.toggle('vecu');
                }if ((this.numeroLlenos === 4 || this.numeroLlenos === 5) && this.numeroLlenosLetra !== 'cuoc') {
                    this.numeroLlenosLetra = 'cuoc';
                    document.getElementById('progreso').classList.toggle('cuoc');
                }if ((this.numeroLlenos === 6 || this.numeroLlenos === 7 || this.numeroLlenos === 8) && this.numeroLlenosLetra !== 'sedo') {
                    this.numeroLlenosLetra = 'sedo';
                    document.getElementById('progreso').classList.toggle('sedo');
                }if ((this.numeroLlenos === 8) && this.numeroLlenosLetra !== 'cien') {
                    this.numeroLlenosLetra = 'cien';
                    document.getElementById('progreso').classList.toggle('cien');
                }
            }if (this.listo === false && this.listoB === true) {
                if ((this.numeroLlenos === 0 || this.numeroLlenos === 1) && this.numeroLlenosLetra !== 'cero') {
                    this.numeroLlenosLetra = 'cero';
                }if ((this.numeroLlenos === 2 || this.numeroLlenos === 3) && this.numeroLlenosLetra !== 'dise') {
                    this.numeroLlenosLetra = 'dise';
                    document.getElementById('progreso').classList.toggle('dise');
                }if ((this.numeroLlenos === 4 || this.numeroLlenos === 5) && this.numeroLlenosLetra !== 'trdo') {
                    this.numeroLlenosLetra = 'trdo';
                    document.getElementById('progreso').classList.toggle('trdo');
                }if ((this.numeroLlenos === 6 || this.numeroLlenos === 7) && this.numeroLlenosLetra !== 'cuoc') {
                    this.numeroLlenosLetra = 'cuoc';
                    document.getElementById('progreso').classList.toggle('cuoc');
                }if ((this.numeroLlenos === 8 || this.numeroLlenos === 9) && this.numeroLlenosLetra !== 'secu') {
                    this.numeroLlenosLetra = 'secu';
                    document.getElementById('progreso').classList.toggle('secu');
                }if ((this.numeroLlenos === 10 || this.numeroLlenos === 11) && this.numeroLlenosLetra !== 'oche') {
                    this.numeroLlenosLetra = 'oche';
                    document.getElementById('progreso').classList.toggle('oche');
                }if (this.numeroLlenos === 11 && this.numeroLlenosLetra !== 'cien') {
                    this.numeroLlenosLetra = 'cien';
                    document.getElementById('progreso').classList.toggle('cien');
                }
            }if (this.listo === true && this.listoB === false) {
                if ((this.numeroLlenos === 0) && this.numeroLlenosLetra !== 'cero') {
                    this.numeroLlenosLetra = 'cero';
                }if ((this.numeroLlenos === 1 || this.numeroLlenos === 2) && this.numeroLlenosLetra !== 'cato') {
                    this.numeroLlenosLetra = 'cato';
                    document.getElementById('progreso').classList.toggle('cato');
                }if ((this.numeroLlenos === 3 || this.numeroLlenos === 4) && this.numeroLlenosLetra !== 'veoc') {
                    this.numeroLlenosLetra = 'veoc';
                    document.getElementById('progreso').classList.toggle('veoc');
                }if ((this.numeroLlenos === 5 || this.numeroLlenos === 6) && this.numeroLlenosLetra !== 'cudo') {
                    this.numeroLlenosLetra = 'cudo';
                    document.getElementById('progreso').classList.toggle('cudo');
                }if ((this.numeroLlenos === 7 || this.numeroLlenos === 8) && this.numeroLlenosLetra !== 'cise') {
                    this.numeroLlenosLetra = 'cise';
                    document.getElementById('progreso').classList.toggle('cise');
                }if ((this.numeroLlenos === 9 || this.numeroLlenos === 10) && this.numeroLlenosLetra !== 'sete') {
                    this.numeroLlenosLetra = 'sete';
                    document.getElementById('progreso').classList.toggle('sete');
                }if ((this.numeroLlenos === 11 || this.numeroLlenos === 12) && this.numeroLlenosLetra !== 'ocdo') {
                    this.numeroLlenosLetra = 'ocdo';
                    document.getElementById('progreso').classList.toggle('ocdo');
                }if (this.numeroLlenos === 13 && this.numeroLlenosLetra !== 'cien') {
                    this.numeroLlenosLetra = 'cien';
                    document.getElementById('progreso').classList.toggle('cien');
                }
            }if (this.listo === true && this.listoB === true) {
                if ((this.numeroLlenos === 0 || this.numeroLlenos === 1) && this.numeroLlenosLetra !== 'cero') {
                    this.numeroLlenosLetra = 'cero';
                }if ((this.numeroLlenos === 2 || this.numeroLlenos === 3) && this.numeroLlenosLetra !== 'doce') {
                    this.numeroLlenosLetra = 'doce';
                    document.getElementById('progreso').classList.toggle('doce');
                }if ((this.numeroLlenos === 4 || this.numeroLlenos === 5) && this.numeroLlenosLetra !== 'vecu') {
                    this.numeroLlenosLetra = 'vecu';
                    document.getElementById('progreso').classList.toggle('vecu');
                }if ((this.numeroLlenos === 6 || this.numeroLlenos === 7) && this.numeroLlenosLetra !== 'trse') {
                    this.numeroLlenosLetra = 'trse';
                    document.getElementById('progreso').classList.toggle('trse');
                }if ((this.numeroLlenos === 8 || this.numeroLlenos === 9) && this.numeroLlenosLetra !== 'cuoc') {
                    this.numeroLlenosLetra = 'cuoc';
                    document.getElementById('progreso').classList.toggle('cuoc');
                }if ((this.numeroLlenos === 10 || this.numeroLlenos === 11) && this.numeroLlenosLetra !== 'osese') {
                    this.numeroLlenosLetra = 'sese';
                    document.getElementById('progreso').classList.toggle('sese');
                }if ((this.numeroLlenos === 12 || this.numeroLlenos === 13) && this.numeroLlenosLetra !== 'sedo') {
                    this.numeroLlenosLetra = 'sedo';
                    document.getElementById('progreso').classList.toggle('sedo');
                }if ((this.numeroLlenos === 14 || this.numeroLlenos === 15 || this.numeroLlenos === 16)
                    && this.numeroLlenosLetra !== 'occu') {
                    this.numeroLlenosLetra = 'occu';
                    document.getElementById('progreso').classList.toggle('occu');
                }if (this.numeroLlenos === 16 && this.numeroLlenosLetra !== 'cien') {
                    this.numeroLlenosLetra = 'cien';
                    document.getElementById('progreso').classList.toggle('cien');
                }
            }
        }
    }

    /**
     * Define cuantos campos estan llenos para actualizar la barra de progreso
     */
    camposLlenosP() {
        this.numeroLlenos = 0;
        if (typeof this.startup.nombre !== 'undefined') {
            if (this.startup.nombre.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.contrasena !== 'undefined') {
            if (this.startup.contrasena.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.sector !== 'undefined') {
            if (this.startup.sector.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.intension !== 'undefined') {
            if (this.startup.intension.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.nomina !== 'undefined' && this.startup.nomina !== null) {
            if (this.startup.nomina.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.prestacion !== 'undefined' && this.startup.prestacion !== null) {
            if (this.startup.prestacion.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.puntoEquilibrio !== 'undefined' && this.startup.puntoEquilibrio !== null) {
            if (this.startup.puntoEquilibrio.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.estrategia !== 'undefined' && this.startup.estrategia !== null) {
            if (this.startup.estrategia.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.tiempoMeta !== 'undefined' && this.startup.tiempoMeta !== null) {
            if (this.startup.tiempoMeta.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.personaContacto !== 'undefined' && this.startup.personaContacto !== null) {
            if (this.startup.personaContacto.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.correoContacto !== 'undefined' && this.startup.correoContacto !== null) {
            if (this.startup.correoContacto.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.telefonoContacto !== 'undefined' && this.startup.telefonoContacto !== null) {
            if (this.startup.telefonoContacto.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.perfilIdentificador !== 'undefined' && this.startup.perfilIdentificador !== null) {
            if (this.startup.perfilIdentificador.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.nombreEncargado !== 'undefined' && this.startup.nombreEncargado !== null) {
            if (this.startup.nombreEncargado.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.correoEncargado !== 'undefined' && this.startup.correoEncargado !== null) {
            if (this.startup.correoEncargado.length !== 0) {
                this.numeroLlenos++;
            }
        }if (typeof this.startup.telefonoEncargado !== 'undefined' && this.startup.telefonoEncargado !== null) {
            if (this.startup.telefonoEncargado.length !== 0) {
                this.numeroLlenos++;
            }
        }
    }

    /**
     * Actualiza la barra de progreso de la informacion de negocio
     * */
    animarInfo() {
        if (this.desabilitar === false) {
            this.camposLlenosInfo();
            if ((this.numeroLlenosInfo === 0 || this.numeroLlenosInfo === 1) && this.numeroLlenosLetraInfo !== 'cero') {
                this.numeroLlenosLetraInfo = 'cero';
            }if ((this.numeroLlenosInfo === 2 || this.numeroLlenosInfo === 3) && this.numeroLlenosLetraInfo !== 'diez') {
                this.numeroLlenosLetraInfo = 'diez';
                document.getElementById('progreso1').classList.toggle('diez');
            }if ((this.numeroLlenosInfo === 4 || this.numeroLlenosInfo === 5) && this.numeroLlenosLetraInfo !== 'vein') {
                this.numeroLlenosLetraInfo = 'vein';
                document.getElementById('progreso1').classList.toggle('vein');
            }if ((this.numeroLlenosInfo === 6 || this.numeroLlenosInfo === 7) && this.numeroLlenosLetraInfo !== 'trei') {
                this.numeroLlenosLetraInfo = 'trei';
                document.getElementById('progreso1').classList.toggle('trei');
            }if ((this.numeroLlenosInfo === 8 || this.numeroLlenosInfo === 9) && this.numeroLlenosLetraInfo !== 'cuar') {
                this.numeroLlenosLetraInfo = 'cuar';
                document.getElementById('progreso1').classList.toggle('cuar');
            }if ((this.numeroLlenosInfo === 10 || this.numeroLlenosInfo === 11) && this.numeroLlenosLetraInfo !== 'cita') {
                this.numeroLlenosLetraInfo = 'cita';
                document.getElementById('progreso1').classList.toggle('cita');
            }if ((this.numeroLlenosInfo === 12 || this.numeroLlenosInfo === 13) && this.numeroLlenosLetraInfo !== 'sese') {
                this.numeroLlenosLetraInfo = 'sese';
                document.getElementById('progreso1').classList.toggle('sese');
            }if (this.numeroLlenosInfo === 14 && this.numeroLlenosLetraInfo !== 'sete') {
                this.numeroLlenosLetraInfo = 'sete';
                document.getElementById('progreso1').classList.toggle('sete');
            }if (this.numeroLlenosInfo === 15 && this.numeroLlenosLetraInfo !== 'ssss') {
                this.numeroLlenosLetraInfo = 'ssss';
                document.getElementById('progreso1').classList.toggle('ssss');
            }if (this.numeroLlenosInfo === 16 && this.numeroLlenosLetraInfo !== 'ocdo') {
                this.numeroLlenosLetraInfo = 'ocdo';
                document.getElementById('progreso1').classList.toggle('ocdo');
            }if (this.numeroLlenosInfo === 17 && this.numeroLlenosLetraInfo !== 'ococ') {
                this.numeroLlenosLetraInfo = 'ococ';
                document.getElementById('progreso1').classList.toggle('ococ');
            }if (this.numeroLlenosInfo === 18 && this.numeroLlenosLetraInfo !== 'nocu') {
                this.numeroLlenosLetraInfo = 'nocu';
                document.getElementById('progreso1').classList.toggle('nocu');
            }if (this.numeroLlenosInfo === 19 && this.numeroLlenosLetraInfo !== 'cien') {
                this.numeroLlenosLetraInfo = 'cien';
                document.getElementById('progreso1').classList.toggle('cien');
            }
        }
    }
    /**
     * Define cuantos campos estan llenos para actualizar la barra de progreso de la informacion de negocio
     */
    camposLlenosInfo() {
        this.numeroLlenosInfo = 0;
        if (typeof this.startup.segmentoCli !== 'undefined' && this.startup.segmentoCli !== null) {
            if (this.startup.segmentoCli.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.segmentoUsu !== 'undefined' && this.startup.segmentoUsu !== null) {
            if (this.startup.segmentoUsu.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.propuestaCli !== 'undefined' && this.startup.propuestaCli !== null) {
            if (this.startup.propuestaCli.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.propuestaUsu !== 'undefined' && this.startup.propuestaUsu !== null) {
            if (this.startup.propuestaUsu.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesInfoCli !== 'undefined' && this.startup.canalesInfoCli !== null) {
            if (this.startup.canalesInfoCli.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesInfoUsu !== 'undefined' && this.startup.canalesInfoUsu !== null) {
            if (this.startup.canalesInfoUsu.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesEvaCli !== 'undefined' && this.startup.canalesEvaCli !== null) {
            if (this.startup.canalesEvaCli.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesEvaUsu !== 'undefined' && this.startup.canalesEvaUsu !== null) {
            if (this.startup.canalesEvaUsu.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesVentaCli !== 'undefined' && this.startup.canalesVentaCli !== null) {
            if (this.startup.canalesVentaCli.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesVentaUsu !== 'undefined' && this.startup.canalesVentaUsu !== null) {
            if (this.startup.canalesVentaUsu.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesEntregaCli !== 'undefined' && this.startup.canalesEntregaCli !== null) {
            if (this.startup.canalesEntregaCli.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesEntregaUsu !== 'undefined' && this.startup.canalesEntregaUsu !== null) {
            if (this.startup.canalesEntregaUsu.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesPosVentaCli !== 'undefined' && this.startup.canalesPosVentaCli !== null) {
            if (this.startup.canalesPosVentaCli.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.canalesPosVentaUsu !== 'undefined' && this.startup.canalesPosVentaUsu !== null) {
            if (this.startup.canalesPosVentaUsu.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.nombreProceso !== 'undefined' && this.startup.nombreProceso !== null) {
            if (this.startup.nombreProceso.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.perspectivaUsuario !== 'undefined' && this.startup.perspectivaUsuario !== null) {
            if (this.startup.perspectivaUsuario.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.perspectivaEmpresa !== 'undefined' && this.startup.perspectivaEmpresa !== null) {
            if (this.startup.perspectivaEmpresa.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.objetivoProceso !== 'undefined' && this.startup.objetivoProceso !== null) {
            if (this.startup.objetivoProceso.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }if (typeof this.startup.descripcionProceso !== 'undefined' && this.startup.descripcionProceso !== null) {
            if (this.startup.descripcionProceso.length !== 0) {
                this.numeroLlenosInfo++;
            }
        }
    }

    /**
     * Pone un mensaje en los campos que no han sido diligenciados cuando se quiere ver la informacion
     */
    llenarCamposParaVer () {
        if (typeof this.startup.nomina === 'undefined' || this.startup.nomina === null) {
            this.startup.nomina = 'No ha sido deligenciado.';
        }if (typeof this.startup.prestacion === 'undefined' || this.startup.prestacion === null) {
            this.startup.prestacion = 'No ha sido deligenciado.';
        }if (typeof this.startup.estrategia === 'undefined' || this.startup.estrategia === null) {
            this.startup.estrategia = 'No ha sido deligenciado.';
        }if (typeof this.startup.tiempoMeta === 'undefined' || this.startup.tiempoMeta === null) {
            this.startup.tiempoMeta = 'No ha sido deligenciado.';
        }if (typeof this.startup.personaContacto === 'undefined' || this.startup.personaContacto === null) {
            this.startup.personaContacto = 'No ha sido deligenciado.';
        }if (typeof this.startup.correoContacto === 'undefined' || this.startup.correoContacto === null) {
            this.startup.correoContacto = 'No ha sido deligenciado.';
        }if (typeof this.startup.telefonoContacto === 'undefined' || this.startup.telefonoContacto === null) {
            this.startup.telefonoContacto = 'No ha sido deligenciado.';
        }if (typeof this.startup.nombreEncargado === 'undefined' || this.startup.nombreEncargado === null) {
            this.startup.nombreEncargado = 'No ha sido deligenciado.';
        }if (typeof this.startup.correoEncargado === 'undefined' || this.startup.correoEncargado === null) {
            this.startup.correoEncargado = 'No ha sido deligenciado.';
        }if (typeof this.startup.telefonoEncargado === 'undefined' || this.startup.telefonoEncargado === null) {
            this.startup.telefonoEncargado = 'No ha sido deligenciado.';
        }
        if (typeof this.startup.segmentoCli === 'undefined' || this.startup.segmentoCli === null) {
            this.startup.segmentoCli = 'No ha sido deligenciado.';
        }if (typeof this.startup.segmentoUsu === 'undefined' || this.startup.segmentoUsu === null) {
            this.startup.segmentoUsu = 'No ha sido deligenciado.';
        }if (typeof this.startup.propuestaCli === 'undefined' || this.startup.propuestaCli === null) {
            this.startup.propuestaCli = 'No ha sido deligenciado.';
        }if (typeof this.startup.propuestaUsu === 'undefined' || this.startup.propuestaUsu === null) {
            this.startup.propuestaUsu = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesInfoCli === 'undefined' || this.startup.canalesInfoCli === null) {
            this.startup.canalesInfoCli = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesInfoUsu === 'undefined' || this.startup.canalesInfoUsu === null) {
            this.startup.canalesInfoUsu = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesEvaCli === 'undefined' || this.startup.canalesEvaCli === null) {
            this.startup.canalesEvaCli = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesEvaUsu === 'undefined' || this.startup.canalesEvaUsu === null) {
            this.startup.canalesEvaUsu = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesVentaCli === 'undefined' || this.startup.canalesVentaCli === null) {
            this.startup.canalesVentaCli = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesVentaUsu === 'undefined' || this.startup.canalesVentaUsu === null) {
            this.startup.canalesVentaUsu = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesEntregaCli === 'undefined' || this.startup.canalesEntregaCli === null) {
            this.startup.canalesEntregaCli = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesEntregaUsu === 'undefined' || this.startup.canalesEntregaUsu === null) {
            this.startup.canalesEntregaUsu = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesPosVentaCli === 'undefined' || this.startup.canalesPosVentaCli === null) {
            this.startup.canalesPosVentaCli = 'No ha sido deligenciado.';
        }if (typeof this.startup.canalesPosVentaUsu === 'undefined' || this.startup.canalesPosVentaUsu === null) {
            this.startup.canalesPosVentaUsu = 'No ha sido deligenciado.';
        }if (typeof this.startup.nombreProceso === 'undefined' || this.startup.nombreProceso === null) {
            this.startup.nombreProceso = 'No ha sido deligenciado.';
        }if (typeof this.startup.perspectivaUsuario === 'undefined' || this.startup.perspectivaUsuario === null) {
            this.startup.perspectivaUsuario = 'No ha sido deligenciado.';
        }if (typeof this.startup.perspectivaEmpresa === 'undefined' || this.startup.perspectivaEmpresa === null) {
            this.startup.perspectivaEmpresa = 'No ha sido deligenciado.';
        }if (typeof this.startup.objetivoProceso === 'undefined' || this.startup.objetivoProceso === null) {
            this.startup.objetivoProceso = 'No ha sido deligenciado.';
        }if (typeof this.startup.descripcionProceso === 'undefined' || this.startup.descripcionProceso === null) {
            this.startup.descripcionProceso = 'No ha sido deligenciado.';
        }
        if (typeof this.startup.personalCli === 'undefined' || this.startup.personalCli === null) {
            this.a = false;
        }
        if (typeof this.startup.autoservicioCli === 'undefined' || this.startup.autoservicioCli === null) {
            this.b = false;
        }
        if (typeof this.startup.automatizadoCli === 'undefined' || this.startup.automatizadoCli === null) {
            this.c = false;
        }
        if (typeof this.startup.comunidadesCli === 'undefined' || this.startup.comunidadesCli === null) {
            this.d = false;
        }
        if (typeof this.startup.personalDedicadoCli === 'undefined' || this.startup.personalDedicadoCli === null) {
            this.e = false;
        }
        if (this.a === false && this.b === false && this.c === false && this.d === false && this.e === false) {
            this.mensajeRelacionamiento = true;
        }
        if (typeof this.startup.personalUsu === 'undefined' || this.startup.personalUsu === null) {
            this.f = false;
            this.mensajeRelacionamientoUsu = false;
        }
        if (typeof this.startup.autoservicioUsu === 'undefined' || this.startup.autoservicioUsu === null) {
            this.mensajeRelacionamientoUsu = false;
            this.g = false;
        }
        if (typeof this.startup.automatizadoUsu === 'undefined' || this.startup.automatizadoUsu === null) {
            this.mensajeRelacionamientoUsu = false;
            this.h = false;
        }
        if (typeof this.startup.comunidadesUsu === 'undefined' || this.startup.comunidadesUsu === null) {
            this.mensajeRelacionamientoUsu = false;
            this.i = false;
        }
        if (typeof this.startup.personalDedicadoUsu === 'undefined' || this.startup.personalDedicadoUsu === null) {
            this.mensajeRelacionamientoUsu = false;
            this.j = false;
        }
        if (this.f === false && this.g === false && this.h === false && this.i === false && this.j === false) {
            this.mensajeRelacionamientoUsu = true;
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
                    } else {
                        console.log(response.mensaje);
                    }
                    this.loading = false;
                }, error => {
                    this.loading = false;
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
                            this.loading = false;
                            console.log(error2);
                        });
                } else {
                    this.contraAdm.value = '';
                    swal('Error', 'La Contraseña No Coincide', 'error');
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                console.log(error);
            });
    }
    /**Fin metodos gestion adm**/
}
