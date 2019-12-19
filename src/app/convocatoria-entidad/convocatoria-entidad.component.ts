import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConvocatoriaService} from '../services/convocatoria.service';
import {EntidadService} from '../services/entidad.service';
import swal from "sweetalert2";
import {RequisitoService} from '../services/requisito.service';
import {StartupService} from '../services/startup.service';
import {ConvocatoriaStartupService} from '../services/convocatoria-startup.service';
import {ProductoService} from '../services/producto.service';
import {AdmService} from '../services/adm.service';
import {DateFormatter} from '@angular/common/src/pipes/deprecated/intl';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-convocatoria-entidad',
  templateUrl: './convocatoria-entidad.component.html',
  styleUrls: ['./convocatoria-entidad.component.css']
})
export class ConvocatoriaEntidadComponent implements OnInit {

  nombreE = null; /**Nombre de la entidad que ingreso al sistema**/
  nombreConvocatoria = null; /**Nombre de la convocatoria a actualizar**/
  convocatoria: any = {}; /**convocatoria en proceso de registro o actualizacion**/
  registerForm: FormGroup; /**Formulario de la convocatoria**/
  numeroLlenosCon = 0; /**numero de campos diligenciados en el formulario de la convocatoria**/
  numeroLlenosLetraCon = null; /**Numero en letra de campos diligenciados en el formulario de la convocatoria **/
  ver = null; /**Variable que define si la vista se llamo desde un admin o desde la entidad**/
  desabilitar = null; /**Variable que desabilita los inputs dependiendo de que usuario este registrado**/
  entidadConAGuardar = null; /**entidad a la que pertenece la convocatoria**/
  todasLasConvocatorias = null; /**almacena todas las convocatorias registradas**/
  convocatoriaCreada = 0; /**Variable que aumenta si la convocatoria ya se encuentra registrada**/
  url = '../../assets/defaultImagen.jpg'; /**url de la imagen de portada de la convocatoria**/
  habilitarImagen = false; /**Habilita la imagen dependiendo del usuario registrado**/
  allStartups = null; /**Variable que almacena todas las startups**/
  camposFaltantes = 0; /**Variable que almacena el numero de campos de informacion que faltan por diligenciar que son requisitos**/
  camposLlenos = 0; /**Variable que almacena el numero de campos de informacion diligenciados que son requisitos**/
  /**Atributos para el formulario de aplicar a una convocatoria**/
  aplicarForm: FormGroup; /**Formulario de las startups que aplican o pueden aplicar a una convocatoria**/
  convocatoria_startup: any = {}; /**Startup que aplico o puede aplicar a una convocatoria**/
  entity = '';/**Si se va a ver la informacion esto define que menu se muestra en la interfaz**/
  /**Atributos para el formulario de requisitos**/
  reqForm: FormGroup; /**Formulario de los requisitos de una convocatoria**/
  req: any = {}; /**Requisitos de la convocatoria**/
  mostrarSig = false; /**Variable que muestra la vista para seleccionar los requisitos de definicion e informacion de la startup**/
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
  nombreStartup = null;
  loading = false;
    /**
     * Metodo constructor donde se obtiene el nombre de la entidad y convocatoria si esta se va a actualizar
     * o se desabilitan los inputs si el usuario que ingreso es una administrador
     * @param {Router} router perimite redirigiise a otra vista
     * @param {ConvocatoriaService} convocatoriaService servicios de la convocatoria
     * @param {ActivatedRoute} routerUrl permite obtener datos que vienen por la url
     * @param {EntidadService} entidadService servicios de la entidad
     * @param {RequisitoService} requisitoService servicios de los requisitos
     * @param {StartupService} startupService servicios de la startup
     * @param {ConvocatoriaStartupService} convocatoria_startupService servicios de la relacion startup y convocatoria
     * @param {ProductoService} productoService servicios de productos
     * @param {AdmService} admService servicios de administrador
     */
  constructor(private  router: Router, private convocatoriaService: ConvocatoriaService, private routerUrl: ActivatedRoute,
              private entidadService: EntidadService, private requisitoService: RequisitoService,
              private productoService: ProductoService, private startupService: StartupService,
              private convocatoria_startupService: ConvocatoriaStartupService, private admService: AdmService) {
    this.nombreE = localStorage.getItem('nombreE');
    this.correoAdm = localStorage.getItem('correo');
    this.nombreConvocatoria = routerUrl.snapshot.params['nombreConv'];
    this.ver = localStorage.getItem('verC');
    this.nombreStartup = localStorage.getItem('startupNom');
    const ent = localStorage.getItem('entidadC');
    console.log(this.ver);
    console.log(this.nombreStartup);
    console.log(ent);
    if (this.ver === 'true') {
        this.desabilitar = true;
        if (ent === 'startup') {
            this.entity = 'startup';
        } else if(ent === 'entidad') {
            this.entity = 'entidad';
        }else {
            this.entity = 'adm';
        }
    } else {
        this.desabilitar = false;
    }
  }

    /**
     * Verfica si se quiere actualizar o registrar una convocatoria
     * y crea todos los inputs de los formularios
     */
  ngOnInit() {
      if (this.nombreConvocatoria !== 'new') {
          this.loading = true;
          this.convocatoriaService.getConvocatoriaByNom(this.nombreConvocatoria)
              .subscribe(response => {
                  if (response.codigo === '200') {
                      this.convocatoria = response.convocatoria;
                      this.convocatoria.entidadCon = this.convocatoria.entidadCon.nombre;
                      this.requisitoService.getRequisitoById(this.convocatoria.requisitos.id).subscribe(r => {
                          this.req = r.requisito;
                          this.url = this.convocatoria.imagen;
                          if (this.url !== '../../assets/defaultImagen.jpg') {
                              this.habilitarImagen = true;
                          }
                          this.animarCon();
                          if (this.desabilitar === true) {
                              this.llenarCamposParaVer();
                          }
                      }, error2 => {
                          console.log(error2);
                      });
                  } else {
                      console.log(response.mensaje);
                  }
                  this.loading = false;
              }, error => {
                  console.log(error);
              });
      }
      this.definirFormularioConvocatoria();
      this.reqForm = new FormGroup({
          'pro': new FormControl(this.req.pro, []),
          'empNom': new FormControl(this.req.empNom, [Validators.pattern('[0-9]*')]),
          'empPre': new FormControl(this.req.empPre, [Validators.pattern('[0-9]*')]),
          'inten': new FormControl(this.req.inten, []),
          'est': new FormControl(this.req.est, []),
          'tieMet': new FormControl(this.req.tieMet, []),
          'perCon': new FormControl(this.req.perCon, []),
          'corCon': new FormControl(this.req.corCon, []),
          'telCon': new FormControl(this.req.telCon, []),
          'nomEnc': new FormControl(this.req.nomEnc, []),
          'corEnc': new FormControl(this.req.corEnc, []),
          'telEnc': new FormControl(this.req.telEnc, []),
          'segMerCli': new FormControl(this.req.segMerCli, []),
          'segMerUsu': new FormControl(this.req.segMerUsu, []),
          'proValCli': new FormControl(this.req.proValCli, []),
          'proValUsu': new FormControl(this.req.proValUsu, []),
          'canInfCli': new FormControl(this.req.canInfCli, []),
          'canInfUsu': new FormControl(this.req.canInfUsu, []),
          'canEvaCli': new FormControl(this.req.canEvaCli, []),
          'canEvaUsu': new FormControl(this.req.canEvaUsu, []),
          'canVenCli': new FormControl(this.req.canVenCli, []),
          'canVenUsu': new FormControl(this.req.canVenUsu, []),
          'canEntCli': new FormControl(this.req.canEntCli, []),
          'canEntUsu': new FormControl(this.req.canEntUsu, []),
          'canPosCli': new FormControl(this.req.canPosCli, []),
          'canPosUsu': new FormControl(this.req.canPosUsu, []),
          'relCli': new FormControl(this.req.relCli, []),
          'relUsu': new FormControl(this.req.relUsu, []),
          'nomPro': new FormControl(this.req.nomPro, []),
          'objPro': new FormControl(this.req.objPro, []),
          'desPro': new FormControl(this.req.desPro, []),
          'metProCli': new FormControl(this.req.metProCli, []),
          'metProUsu': new FormControl(this.req.metProUsu, [])
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
      this.convocatoria.imagen = '../../assets/defaultImagen.jpg';
      if (this.desabilitar === false) {
          this.entidadService.getEntidadByNom(this.nombreE)
              .subscribe(response => {
                  this.entidadConAGuardar = response.entidad;
                  this.convocatoria.entidadCon = this.nombreE;
              }, error2 => {
                  console.log(error2);
              });
      }
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

    /**Metodos para registrar una convocatoria**/

    /**
     * Evento del boton aceptar en el formulario de la convocatoria
     * Identifica si el nombre de la convocatoria ya esta registrado
     */
    aceptar() {
        if (!this.registerForm.valid || this.desabilitar || !this.reqForm.valid) {
            swal('ERROR', 'No es posible guardar los datos', 'error');
        } else {
            this.loading = true;
            const fecha = new Date();
            let fechaActual;
            console.log(fecha.getDate());
            if(fecha.getDate() == 1 || fecha.getDate() == 2 || fecha.getDate() == 3 || fecha.getDate() == 4 || fecha.getDate() == 5 ||
              fecha.getDate() == 6 ||fecha.getDate() == 7 ||fecha.getDate() == 8 ||fecha.getDate() == 9 || fecha.getDate() == 10){
               fechaActual = fecha.getFullYear() + '-0' + (fecha.getMonth() + 1) + '-0' + fecha.getDate();
            }else{
               fechaActual = fecha.getFullYear() + '-0' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
            }
            if (fechaActual <= this.convocatoria.apertura || this.convocatoria.estado === 'Proxima a abrir') {
                if (this.convocatoria.apertura <= this.convocatoria.cierre || this.convocatoria.estado === 'Proxima a abrir') {
                    this.volverNullCheck();
                    this.convocatoriaService.getConvocatorias().subscribe(todas => {
                        this.convocatoriaCreada = 0;
                        this.todasLasConvocatorias = todas.convocatorias;
                        if (this.todasLasConvocatorias !== null) {
                            this.todasLasConvocatorias.forEach(el => {
                                if (el.nombre.toUpperCase() === this.convocatoria.nombre.toUpperCase()) {
                                    this.convocatoriaCreada++;
                                }
                            });
                        }
                        this.crearOActualizar();
                    }, error2 => {
                        console.log(error2);
                    });
                } else {
                    swal('ERROR', 'La fecha de apertura no puede ser mayor a la fecha de cierre.', 'error');
                    this.loading = false;
                }
            } else {
                swal('ERROR', 'La fecha de apertura no puede ser menor a la fecha actual.', 'error');
                this.loading = false;
            }
        }
    }

    /**
     * Responde al usuario si el nombre ya esta registrado
     * de lo contrario continua con el proceso del registro
     */
    crearOActualizar() {
        if (this.nombreConvocatoria === 'new') {
            if (this.convocatoriaCreada === 0) {
                this.conStartAplican();
            } else {
                swal('¡ERROR!', 'El Nombre De La Convocatoria Ya Se Encuentra Registrado', 'error');
                this.loading = false;
            }
        } else {
            this.conStartAplican();
        }
    }

    /**
     * Define el numero de startups que pueden aplicar
     */
    conStartAplican() {
        this.startupService.getStartups().subscribe(resp => {
            this.allStartups = resp.startups;
            if (this.allStartups !== null) {
                this.convocatoria.cantidadPuedenAplicar = this.allStartups.length;
            } else {
                this.convocatoria.cantidadPuedenAplicar = 0;
            }
            this.convocatoria.cantidadAplica = 0;
            this.consultaSave();
        }, error2 => {
            console.log(error2);
            this.loading = false;
        });
    }

    /**
     * Crea o actualiza una convocatoria dependiendo
     * desde donde se ingreso a la vista actual
     */
    consultaSave() {
        if (typeof this.convocatoria.estado === 'undefined' || this.convocatoria.estado === null) {
            this.convocatoria.estado = 'Proxima a abrir';
        }
        // if (this.convocatoria.imagen === '../../assets/defaultImagen.jpg') {
        //     swal('ERROR', 'La convocatoria debe tener una imagen', 'error');
        // } else {
            this.convocatoria.entidadCon = this.entidadConAGuardar;
            this.convocatoria.requisitos = this.req;
            this.convocatoriaService.saveConvocatoria(this.convocatoria).subscribe(
                response => {
                    if (response.codigo === '200') {
                        this.relacionStartupsConv();
                        if (this.nombreConvocatoria === 'new') {
                            swal('¡Registrado!', 'Tu Convocatoria Fue Registrada Exitosamente', 'success');
                            this.router.navigateByUrl('principalEntidad/entidad');
                        } else {
                            swal('¡Hecho!', 'Tus Datos Fueron Actualizados Exitosamente', 'success');
                            this.router.navigateByUrl('principalEntidad/entidad');
                        }
                    } else {
                        console.log(response.mensaje);
                    }
                    this.loading = false;
                }, error => {
                    console.log(error);
                    this.loading = false;
                });
        /**}**/
    }

    /**
     * Crea la relacion entre las startups y la convocatoria creada
     */
    relacionStartupsConv() {
        if (this.convocatoria.estado === 'Abierta') {
            if (this.allStartups !== null) {
                this.convocatoria_startup.aplico = 'false';
                this.convocatoriaService.getConvocatoriaByNom(this.convocatoria.nombre).subscribe(miConv => {
                    this.convocatoria_startup.convocatoriaApli = miConv.convocatoria;
                    this.allStartups.forEach(elem => {
                        this.startupService.getStartupByNom(elem.nombre).subscribe(miStar => {
                            this.convocatoria_startup.startupApli = miStar.startup;
                            this.porcentajeFaltante(this.convocatoria_startup.startupApli);
                        }, error2 => {
                            console.log(error2);
                        });
                    });
                }, error2 => {
                    console.log(error2);
                });
            } else {
                console.log('No existen startups registradas');
            }
        }
    }

    /**
     * Conoce que startups pueden aplicar o no
     * @param startup a verificar si aplica para la convocatoria
     * @returns true si saplica o false si no
     */
    porcentajeFaltante(startup) {
        this.camposFaltantes = 0;
        this.camposLlenos = 0;
        if (this.convocatoria.requisitos.perCon === true) {
            if (typeof startup.personaContacto === 'undefined' || startup.personaContacto === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.corCon === true) {
            if (typeof startup.correoContacto === 'undefined' || startup.correoContacto === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.telCon === true) {
            if (typeof startup.telefonoContacto === 'undefined' || startup.telefonoContacto === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.est === true) {
            if (typeof startup.estrategia === 'undefined' || startup.estrategia === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.tieMet === true) {
            if (typeof startup.tiempoMeta === 'undefined' || startup.tiempoMeta === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.nomEnc === true) {
            if (typeof startup.nombreEncargado === 'undefined' || startup.nombreEncargado === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.corEnc === true) {
            if (typeof startup.correoEncargado === 'undefined' || startup.correoEncargado === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.telEnc === true) {
            if (typeof startup.telefonoEncargado === 'undefined' || startup.telefonoEncargado === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.segMerCli === true) {
            if (typeof startup.segmentoCli === 'undefined' || startup.segmentoCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.segMerUsu === true) {
            if (typeof startup.segmentoUsu === 'undefined' || startup.segmentoUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.proValCli === true) {
            if (typeof startup.propuestaCli === 'undefined' || startup.propuestaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.proValUsu === true) {
            if (typeof startup.propuestaUsu === 'undefined' || startup.propuestaUsu === null) {
                this.camposFaltantes++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canInfCli === true) {
            if (typeof startup.canalesInfoCli === 'undefined' || startup.canalesInfoCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canInfUsu === true) {
            if (typeof startup.canalesInfoUsu === 'undefined' || startup.canalesInfoUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canEvaCli === true) {
            if (typeof startup.canalesEvaCli === 'undefined' || startup.canalesEvaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canEvaUsu === true) {
            if (typeof startup.canalesEvaUsu === 'undefined' || startup.canalesEvaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canVenCli === true) {
            if (typeof startup.canalesVentaCli === 'undefined' || startup.canalesVentaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canVenUsu === true) {
            if (typeof startup.canalesVentaUsu === 'undefined' || startup.canalesVentaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canEntCli === true) {
            if (typeof startup.canalesEntregaCli === 'undefined' || startup.canalesEntregaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canEntUsu === true) {
            if (typeof startup.canalesEntregaUsu === 'undefined' || startup.canalesEntregaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canPosCli === true) {
            if (typeof startup.canalesPosVentaCli === 'undefined' || startup.canalesPosVentaCli === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.canPosUsu === true) {
            if (typeof startup.canalesPosVentaUsu === 'undefined' || startup.canalesPosVentaUsu === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.nomPro === true) {
            if (typeof startup.nombreProceso === 'undefined' || startup.nombreProceso === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.objPro === true) {
            if (typeof startup.objetivoProceso === 'undefined' || startup.objetivoProceso === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.desPro === true) {
            if (typeof startup.descripcionProceso === 'undefined' || startup.descripcionProceso === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.metProCli === true) {
            if (typeof startup.perspectivaEmpresa === 'undefined' || startup.perspectivaEmpresa === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        if (this.convocatoria.requisitos.metProUsu === true) {
            if (typeof startup.perspectivaUsuario === 'undefined' || startup.perspectivaUsuario === null) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
        this.relacionamientoCli(startup);
        this.relacionamientoUsu(startup);
        this.empleadosNom(startup);
        this.empleadosPre(startup);
        this.convocatoria_startup.porcentaje = ((this.camposFaltantes * 100) / (this.camposLlenos + this.camposFaltantes));
        this.convocatoria_startupService.saveConvocatoria_startup(this.convocatoria_startup).subscribe(
            relacion => {
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
    }

    /**
     * Si un checkbox es falso lo vuelve nulo para poder deseleccionarlo
     */
    volverNullCheck() {
        if (this.req.pro === false) {
            this.req.pro = null;
        }if (this.req.perCon === false) {
            this.req.perCon = null;
        }if (this.req.corCon === false) {
            this.req.corCon = null;
        }if (this.req.telCon === false) {
            this.req.telCon = null;
        }if (this.req.est === false) {
            this.req.est = null;
        }if (this.req.tieMet === false) {
            this.req.tieMet = null;
        }if (this.req.nomEnc === false) {
            this.req.nomEnc = null;
        }if (this.req.corEnc === false) {
            this.req.corEnc = null;
        }if (this.req.telEnc === false) {
            this.req.telEnc = null;
        }if (this.req.segMerCli === false) {
            this.req.segMerCli = null;
        }if (this.req.segMerUsu === false) {
            this.req.segMerUsu = null;
        }if (this.req.proValCli === false) {
            this.req.proValCli = null;
        }if (this.req.proValUsu === false) {
            this.req.proValUsu = null;
        }if (this.req.canInfCli === false) {
            this.req.canInfCli = null;
        }if (this.req.canInfUsu === false) {
            this.req.canInfUsu = null;
        }if (this.req.canEvaCli === false) {
            this.req.canEvaCli = null;
        }if (this.req.canEvaUsu === false) {
            this.req.canEvaUsu = null;
        }if (this.req.canVenCli === false) {
            this.req.canVenCli = null;
        }if (this.req.canVenUsu === false) {
            this.req.canVenUsu = null;
        }if (this.req.canEntCli === false) {
            this.req.canEntCli = null;
        }if (this.req.canEntUsu === false) {
            this.req.canEntUsu = null;
        }if (this.req.canPosCli === false) {
            this.req.canPosCli = null;
        }if (this.req.canPosUsu === false) {
            this.req.canPosUsu = null;
        }if (this.req.relCli === false) {
            this.req.relCli = null;
        }if (this.req.relUsu === false) {
            this.req.relUsu = null;
        }if (this.req.nomPro === false) {
            this.req.nomPro = null;
        }if (this.req.objPro === false) {
            this.req.objPro = null;
        }if (this.req.desPro === false) {
            this.req.desPro = null;
        }if (this.req.metProCli === false) {
            this.req.metProCli = null;
        }if (this.req.metProUsu === false) {
            this.req.metProUsu = null;
        }
    }
    /**Fin metodos de creacion de una convocatoria**/

    /**Metodos de verificacion cuando una startup aplica a una convocatoria**/

    /**
     * Comprueba si el campo relacionamiento cliente tiene algun dato
     * para ver si es un dato que falta o ya esta diligenciado
     * @param startup a verificar si aplica para la convocatoria
     */
    relacionamientoCli(startup) {
        if (this.convocatoria.requisitos.relCli === true) {
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
    relacionamientoUsu(startup) {
        if (this.convocatoria.requisitos.relUsu === true) {
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
    empleadosNom(startup) {
        if (typeof this.convocatoria.requisitos.empNom !== 'undefined' && this.convocatoria.requisitos.empNom !== null &&
            this.convocatoria.requisitos.empNom !== '') {
            if (typeof startup.nomina === 'undefined' || startup.nomina === null || startup.nomina === '') {
                this.camposFaltantes ++;
            } else if (Number(this.convocatoria.requisitos.empNom) > Number(startup.nomina)) {
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
    empleadosPre(startup) {
        if (typeof this.convocatoria.requisitos.empPre !== 'undefined' && this.convocatoria.requisitos.empPre !== null &&
            this.convocatoria.requisitos.empPre !== '') {
            if (typeof startup.prestacion === 'undefined' || startup.prestacion === null || startup.prestacion === '') {
                this.camposFaltantes ++;
            } else if (Number(this.convocatoria.requisitos.empPre) > Number(startup.prestacion)) {
                this.camposFaltantes ++;
            } else {
                this.camposLlenos ++;
            }
        }
    }
    /**Fin metodos de verificacion cuando una startup puede aplicar a una convocatoria**/

    definirFormularioConvocatoria() {
        this.registerForm = new FormGroup({
            'imagen': new FormControl(this.convocatoria.imagen, []),
            'nombre': new FormControl(this.convocatoria.nombre, [Validators.required, Validators.maxLength(this.maxLengthInputs)]),
            'estado': new FormControl(this.convocatoria.estado, [Validators.required]),
            'apertura': new FormControl(this.convocatoria.apertura, []),
            'cierre': new FormControl(this.convocatoria.cierre, []),
            'proposito': new FormControl(this.convocatoria.proposito, [
                Validators.required, Validators.maxLength(this.maxLengthInputs)]),
            'dirigido': new FormControl(this.convocatoria.dirigido, [Validators.maxLength(this.maxLengthInputs)]),
            'nivel': new FormControl(this.convocatoria.nivel, [Validators.maxLength(this.maxLengthInputs)]),
            'recursos': new FormControl(this.convocatoria.recursos, [Validators.maxLength(this.maxLengthInputs)]),
            'beneficios': new FormControl(this.convocatoria.beneficios, [Validators.maxLength(this.maxLengthInputs)]),
            'descripcionProceso': new FormControl(this.convocatoria.descripcionProceso, [Validators.maxLength(this.maxLengthInputs)]),
            'facebookC': new FormControl(this.convocatoria.facebookC, [Validators.maxLength(this.maxLengthInputs)]),
            'linkedlnC': new FormControl(this.convocatoria.linkedlnC, [Validators.maxLength(this.maxLengthInputs)]),
            'twitterC': new FormControl(this.convocatoria.twitterC, [Validators.maxLength(this.maxLengthInputs)]),
            'whatsappC': new FormControl(this.convocatoria.whatsappC, [Validators.maxLength(this.maxLengthInputs)]),
            'instagramC': new FormControl(this.convocatoria.instagramC, [Validators.maxLength(this.maxLengthInputs)]),
            'webOficial': new FormControl(this.convocatoria.webOficial, [Validators.maxLength(this.maxLengthInputs)]),
            'correoOficial': new FormControl(this.convocatoria.correoOficial, [Validators.maxLength(this.maxLengthInputs)]),
            'numero': new FormControl(this.convocatoria.numero, [Validators.maxLength(this.maxLengthInputs)]),
            'entidadCon': new FormControl(this.convocatoria.entidadCon, []),
            'requisitos': new FormControl(this.convocatoria.requisitos, []),
            'cantidadAplica': new FormControl(this.convocatoria.cantidadAplica, []),
            'cantidadPuedenAplicar': new FormControl(this.convocatoria.cantidadPuedenAplicar, []),
            'terminos': new FormControl(this.convocatoria.terminos, []),
            'respuestas': new FormControl(this.convocatoria.respuestas, []),
            'anexos': new FormControl(this.convocatoria.anexos, []),
            'otrosDocumentos': new FormControl(this.convocatoria.otrosDocumentos, [])
        });
        if (this.convocatoria.estado === 'Abierta') {
            this.registerForm = new FormGroup({
                'imagen': new FormControl(this.convocatoria.imagen, []),
                'nombre': new FormControl(this.convocatoria.nombre, [Validators.required, Validators.maxLength(this.maxLengthInputs)]),
                'estado': new FormControl(this.convocatoria.estado, [Validators.required]),
                'apertura': new FormControl(this.convocatoria.apertura, [Validators.required]),
                'cierre': new FormControl(this.convocatoria.cierre, [Validators.required]),
                'proposito': new FormControl(this.convocatoria.proposito, [Validators.required,
                    Validators.maxLength(this.maxLengthInputs)]),
                'dirigido': new FormControl(this.convocatoria.dirigido, []),
                'nivel': new FormControl(this.convocatoria.nivel, []),
                'recursos': new FormControl(this.convocatoria.recursos, []),
                'beneficios': new FormControl(this.convocatoria.beneficios, []),
                'descripcionProceso': new FormControl(this.convocatoria.descripcionProceso, []),
                'facebookC': new FormControl(this.convocatoria.facebookC, []),
                'linkedlnC': new FormControl(this.convocatoria.linkedlnC, []),
                'twitterC': new FormControl(this.convocatoria.twitterC, []),
                'whatsappC': new FormControl(this.convocatoria.whatsappC, []),
                'instagramC': new FormControl(this.convocatoria.instagramC, []),
                'webOficial': new FormControl(this.convocatoria.webOficial, []),
                'correoOficial': new FormControl(this.convocatoria.correoOficial, []),
                'numero': new FormControl(this.convocatoria.numero, []),
                'entidadCon': new FormControl(this.convocatoria.entidadCon, []),
                'requisitos': new FormControl(this.convocatoria.requisitos, []),
                'cantidadAplica': new FormControl(this.convocatoria.cantidadAplica, []),
                'cantidadPuedenAplicar': new FormControl(this.convocatoria.cantidadPuedenAplicar, []),
                'terminos': new FormControl(this.convocatoria.terminos, []),
                'respuestas': new FormControl(this.convocatoria.respuestas, []),
                'anexos': new FormControl(this.convocatoria.anexos, []),
                'otrosDocumentos': new FormControl(this.convocatoria.otrosDocumentos, [])
            });
        }
    }

    /**
     * Redirige a la vista del perfil de la entidad
     * para modificar sus datos
     */
    editarInfoE() {
        localStorage.setItem('verE', 'false');
        this.router.navigateByUrl('entidad/' + this.nombreE);
    }

    /**
     * Recarga la vista actual para crear una convocatoria
     */
    editarInfoC() {
        localStorage.setItem('verC', 'false');
        this.router.navigateByUrl('convocatoriasEntidad/new');
    }

    /**
     * Carga la imagen de portada de la convocatoria que la entidad selecciona
     * @param event evento que hace la entidad al pulsar el boton
     */
    readUrl(event: any) {
        this.habilitarImagen = true;
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev: any) => {
                this.url = ev.target.result;
                this.convocatoria.imagen = ev.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    /**
     * Elimina la imagen de portada subida por la entidad
     */
    eliminarImagen() {
        this.url = '../../assets/defaultImagen.jpg';
        this.convocatoria.imagen = this.url;
    }

    /**
     * Cambia una variable para poder seleccionar los
     * requisitos de informacion de una startup
     */
    sigModal() {
        this.mostrarSig = true;
    }

    /**
     * Cambia una variable para poder seleccionar los
     * requisitos de definicion de una startup
     */
    volModal() {
        this.mostrarSig = false;
    }

    /**Metodos para la animacion de la barra de progreso**/
    animarConA() {
      if (typeof this.convocatoria.nombre !== 'undefined') {
        if (this.convocatoria.nombre.length === 1 || this.convocatoria.nombre.length === 0) {
         this.animarCon();
         }
      }
    }
    animarConB(newValue) {
      this.convocatoria.estado = newValue;
      if (typeof this.convocatoria.estado !== 'undefined' && this.convocatoria.estado !== null) {
        if (this.convocatoria.estado.length >= 0) {
          this.animarCon();
          this.definirFormularioConvocatoria();
          }
      }
    }
    animarConC() {
        if (typeof this.convocatoria.apertura !== 'undefined') {
            if (this.convocatoria.apertura.length >= 1 || this.convocatoria.apertura.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConD() {
        if (typeof this.convocatoria.cierre !== 'undefined') {
            if (this.convocatoria.cierre.length >= 1 || this.convocatoria.cierre.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConE() {
        if (typeof this.convocatoria.proposito !== 'undefined') {
            if (this.convocatoria.proposito.length === 1 || this.convocatoria.proposito.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConF() {
        if (typeof this.convocatoria.dirigido !== 'undefined') {
            if (this.convocatoria.dirigido.length === 1 || this.convocatoria.dirigido.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConG(newValue) {
        this.convocatoria.nivel = newValue;
        if (typeof this.convocatoria.nivel !== 'undefined' && this.convocatoria.nivel !== null) {
            if (this.convocatoria.nivel.length >= 0) {
                this.animarCon();
            }
        }
    }
    animarConH() {
        if (typeof this.convocatoria.recursos !== 'undefined') {
            if (this.convocatoria.recursos.length === 1 || this.convocatoria.recursos.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConI() {
        if (typeof this.convocatoria.beneficios !== 'undefined') {
            if (this.convocatoria.beneficios.length === 1 || this.convocatoria.beneficios.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConK() {
        if (typeof this.convocatoria.descripcionProceso !== 'undefined') {
            if (this.convocatoria.descripcionProceso.length === 1 || this.convocatoria.descripcionProceso.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConL() {
        if (typeof this.convocatoria.facebookC !== 'undefined') {
            if (this.convocatoria.facebookC.length === 1 || this.convocatoria.facebookC.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConM() {
        if (typeof this.convocatoria.linkedlnC !== 'undefined') {
            if (this.convocatoria.linkedlnC.length === 1 || this.convocatoria.linkedlnC.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConN() {
        if (typeof this.convocatoria.twitterC !== 'undefined') {
            if (this.convocatoria.twitterC.length === 1 || this.convocatoria.twitterC.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConO() {
        if (typeof this.convocatoria.whatsappC !== 'undefined') {
            if (this.convocatoria.whatsappC.length === 1 || this.convocatoria.whatsappC.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConP() {
        if (typeof this.convocatoria.instagramC !== 'undefined') {
            if (this.convocatoria.instagramC.length === 1 || this.convocatoria.instagramC.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConQ() {
        if (typeof this.convocatoria.webOficial !== 'undefined') {
            if (this.convocatoria.webOficial.length === 1 || this.convocatoria.webOficial.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConR() {
        if (typeof this.convocatoria.correoOficial !== 'undefined') {
            if (this.convocatoria.correoOficial.length === 1 || this.convocatoria.correoOficial.length === 0) {
                this.animarCon();
            }
        }
    }
    animarConS() {
        if (typeof this.convocatoria.numero !== 'undefined') {
            if (this.convocatoria.numero.length === 1 || this.convocatoria.numero.length === 0) {
                this.animarCon();
            }
        }
    }
    /**
     * Actualiza la barra de progreso de la informacion de convocatoria
     * */
    animarCon() {
        if (this.desabilitar === false) {
            this.camposLlenosCon();
            if (this.numeroLlenosCon === 0 && this.numeroLlenosLetraCon !== 'cero') {
                this.numeroLlenosLetraCon = 'cero';
            }if (this.numeroLlenosCon === 2 && this.numeroLlenosLetraCon !== 'diez') {
                this.numeroLlenosLetraCon = 'diez';
                document.getElementById('progresoCon').classList.toggle('diez');
            }if (this.numeroLlenosCon === 4 && this.numeroLlenosLetraCon !== 'vein') {
                this.numeroLlenosLetraCon = 'vein';
                document.getElementById('progresoCon').classList.toggle('vein');
            }if (this.numeroLlenosCon === 6 && this.numeroLlenosLetraCon !== 'trei') {
                this.numeroLlenosLetraCon = 'trei';
                document.getElementById('progresoCon').classList.toggle('trei');
            }if (this.numeroLlenosCon === 8 && this.numeroLlenosLetraCon !== 'cuar') {
                this.numeroLlenosLetraCon = 'cuar';
                document.getElementById('progresoCon').classList.toggle('cuar');
            }if (this.numeroLlenosCon === 10 && this.numeroLlenosLetraCon !== 'cita') {
                this.numeroLlenosLetraCon = 'cita';
                document.getElementById('progresoCon').classList.toggle('cita');
            }if (this.numeroLlenosCon === 12 && this.numeroLlenosLetraCon !== 'sese') {
                this.numeroLlenosLetraCon = 'sese';
                document.getElementById('progresoCon').classList.toggle('sese');
            }if (this.numeroLlenosCon === 14 && this.numeroLlenosLetraCon !== 'sete') {
                this.numeroLlenosLetraCon = 'sete';
                document.getElementById('progresoCon').classList.toggle('sete');
            }if (this.numeroLlenosCon === 16 && this.numeroLlenosLetraCon !== 'oche') {
                this.numeroLlenosLetraCon = 'oche';
                document.getElementById('progresoCon').classList.toggle('oche');
            }if (this.numeroLlenosCon === 17 && this.numeroLlenosLetraCon !== 'nove') {
                this.numeroLlenosLetraCon = 'nove';
                document.getElementById('progresoCon').classList.toggle('nove');
            }if (this.numeroLlenosCon === 18 && this.numeroLlenosLetraCon !== 'cien') {
                this.numeroLlenosLetraCon = 'cien';
                document.getElementById('progresoCon').classList.toggle('cien');
            }
        }
    }
    /**
     * Define cuantos campos estan llenos para actualizar la barra de progreso de la informacion de la convocatoria
     */
    camposLlenosCon() {
        this.numeroLlenosCon = 0;
        if (typeof this.convocatoria.nombre !== 'undefined' && this.convocatoria.nombre !== null) {
            if (this.convocatoria.nombre.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.estado !== 'undefined' && this.convocatoria.estado !== null) {
            if (this.convocatoria.estado.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.apertura !== 'undefined' && this.convocatoria.apertura !== null) {
            if (this.convocatoria.apertura.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.cierre !== 'undefined' && this.convocatoria.cierre !== null) {
            if (this.convocatoria.cierre.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.proposito !== 'undefined' && this.convocatoria.proposito !== null) {
            if (this.convocatoria.proposito.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.dirigido !== 'undefined' && this.convocatoria.dirigido !== null) {
            if (this.convocatoria.dirigido.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.nivel !== 'undefined' && this.convocatoria.nivel !== null) {
            if (this.convocatoria.nivel.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.recursos !== 'undefined' && this.convocatoria.recursos !== null) {
            if (this.convocatoria.recursos.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.beneficios !== 'undefined' && this.convocatoria.beneficios !== null) {
            if (this.convocatoria.beneficios.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.descripcionProceso !== 'undefined' && this.convocatoria.descripcionProceso !== null) {
            if (this.convocatoria.descripcionProceso.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.facebookC !== 'undefined' && this.convocatoria.facebookC !== null) {
            if (this.convocatoria.facebookC.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.linkedlnC !== 'undefined' && this.convocatoria.linkedlnC !== null) {
            if (this.convocatoria.linkedlnC.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.twitterC !== 'undefined' && this.convocatoria.twitterC !== null) {
            if (this.convocatoria.twitterC.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.whatsappC !== 'undefined' && this.convocatoria.whatsappC !== null) {
            if (this.convocatoria.whatsappC.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.instagramC !== 'undefined' && this.convocatoria.instagramC !== null) {
            if (this.convocatoria.instagramC.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.webOficial !== 'undefined' && this.convocatoria.webOficial !== null) {
            if (this.convocatoria.webOficial.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.correoOficial !== 'undefined' && this.convocatoria.correoOficial !== null) {
            if (this.convocatoria.correoOficial.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
        if (typeof this.convocatoria.numero !== 'undefined' && this.convocatoria.numero !== null) {
            if (this.convocatoria.numero.length !== 0) {
                this.numeroLlenosCon++;
            }
        }
    }
    /**Fin de metodos de la barra de progreso*/

    /**
     * Pone un mensaje en los campos que no han sido diligenciados cuando se quiere ver la informacion
     */
    llenarCamposParaVer () {
        if (typeof this.convocatoria.nombre === 'undefined' || this.convocatoria.nombre === null) {
            this.convocatoria.nombre = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.estado === 'undefined' || this.convocatoria.estado === null) {
            this.convocatoria.estado = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.apertura === 'undefined' || this.convocatoria.apertura === null) {
            this.convocatoria.apertura = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.cierre === 'undefined' || this.convocatoria.cierre === null) {
            this.convocatoria.cierre = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.proposito === 'undefined' || this.convocatoria.proposito === null) {
            this.convocatoria.proposito = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.dirigido === 'undefined' || this.convocatoria.dirigido === null) {
            this.convocatoria.dirigido = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.nivel === 'undefined' || this.convocatoria.nivel === null) {
            this.convocatoria.nivel = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.recursos === 'undefined' || this.convocatoria.recursos === null) {
            this.convocatoria.recursos = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.beneficios === 'undefined' || this.convocatoria.beneficios === null) {
            this.convocatoria.beneficios = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.descripcionProceso === 'undefined' || this.convocatoria.descripcionProceso === null) {
            this.convocatoria.descripcionProceso = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.facebookC === 'undefined' || this.convocatoria.facebookC === null) {
            this.convocatoria.facebookC = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.linkedlnC === 'undefined' || this.convocatoria.linkedlnC === null) {
            this.convocatoria.linkedlnC = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.twitterC === 'undefined' || this.convocatoria.twitterC === null) {
            this.convocatoria.twitterC = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.whatsappC === 'undefined' || this.convocatoria.whatsappC === null) {
            this.convocatoria.whatsappC = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.instagramC === 'undefined' || this.convocatoria.instagramC === null) {
            this.convocatoria.instagramC = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.webOficial === 'undefined' || this.convocatoria.webOficial === null) {
            this.convocatoria.webOficial = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.correoOficial === 'undefined' || this.convocatoria.correoOficial === null) {
            this.convocatoria.correoOficial = 'No ha sido deligenciado.';
        }if (typeof this.convocatoria.numero === 'undefined' || this.convocatoria.numero === null) {
            this.convocatoria.numero = 'No ha sido deligenciado.';
        }
        if (typeof this.req.empNom === 'undefined' || this.req.empNom === null) {
            this.req.empNom = 'No ha sido deligenciado.';
        }
        if (typeof this.req.empPre === 'undefined' || this.req.empPre === null) {
            this.req.empPre = 'No ha sido deligenciado.';
        }
    }

    /**
     *Metodos gets de los inputs de los formularios
     * de convocatoria y requisitos
     * */
    get imagen() {
        return this.registerForm.get('imagen');
    }
    get entidadCon() {
        return this.registerForm.get('entidadCon');
    }
    get nombre() {
        return this.registerForm.get('nombre');
    }
    get estado() {
        return this.registerForm.get('estado');
    }
    get apertura() {
        return this.registerForm.get('apertura');
    }
    get cierre() {
        return this.registerForm.get('cierre');
    }
    get proposito() {
        return this.registerForm.get('proposito');
    }
    get dirigido() {
        return this.registerForm.get('dirigido');
    }
    get nivel() {
        return this.registerForm.get('entidadCon');
    }
    get recursos() {
        return this.registerForm.get('recursos');
    }
    get beneficios() {
        return this.registerForm.get('beneficios');
    }
    get facebookC() {
        return this.registerForm.get('facebookC');
    }
    get linkedlnC() {
        return this.registerForm.get('linkedlnC');
    }
    get twitterC() {
        return this.registerForm.get('twitterC');
    }
    get whatsappC() {
        return this.registerForm.get('whatsappC');
    }
    get instagramC() {
        return this.registerForm.get('instagramC');
    }
    get webOficial() {
        return this.registerForm.get('webOficial');
    }
    get correoOficial() {
        return this.registerForm.get('correoOficial');
    }
    get numero() {
        return this.registerForm.get('numero');
    }
    get cantidadAplica() {
        return this.registerForm.get('cantidadAplica');
    }
    get secEco() {
        return this.reqForm.get('secEco');
    }
    get pro() {
        return this.reqForm.get('pro');
    }
    get empNom() {
        return this.reqForm.get('empNom');
    }
    get empPre() {
        return this.reqForm.get('empPre');
    }
    get inten() {
        return this.reqForm.get('inten');
    }
    get est() {
        return this.reqForm.get('est');
    }
    get tieMet() {
        return this.reqForm.get('tieMet');
    }
    get perCon() {
        return this.reqForm.get('perCon');
    }
    get corCon() {
        return this.reqForm.get('corCon');
    }
    get telCon() {
        return this.reqForm.get('telCon');
    }
    get nomEnc() {
        return this.reqForm.get('nomEnc');
    }
    get corEnc() {
        return this.reqForm.get('corEnc');
    }
    get telEnc() {
        return this.reqForm.get('telEnc');
    }
    get segMerCli() {
        return this.reqForm.get('segMerCli');
    }
    get segMerUsu() {
        return this.reqForm.get('segMerUsu');
    }
    get proValCli() {
        return this.reqForm.get('proValCli');
    }
    get proValUsu() {
        return this.reqForm.get('proValUsu');
    }
    get canInfCli() {
        return this.reqForm.get('canInfCli');
    }
    get canInfUsu() {
        return this.reqForm.get('canInfUsu');
    }
    get canEvaCli() {
        return this.reqForm.get('canEvaCli');
    }
    get canEvaUsu() {
        return this.reqForm.get('canEvaUsu');
    }
    get canVenCli() {
        return this.reqForm.get('canVenCli');
    }
    get canVenUsu() {
        return this.reqForm.get('canVenUsu');
    }
    get canEntCli() {
        return this.reqForm.get('canEntCli');
    }
    get canEntUsu() {
        return this.reqForm.get('canEntUsu');
    }
    get canPosCli() {
        return this.reqForm.get('canPosCli');
    }
    get canPosUsu() {
        return this.reqForm.get('canPosUsu');
    }
    get relCli() {
        return this.reqForm.get('relCli');
    }
    get relUsu() {
        return this.reqForm.get('relUsu');
    }
    get nomPro() {
        return this.reqForm.get('nomPro');
    }
    get objPro() {
        return this.reqForm.get('objPro');
    }
    get desPro() {
        return this.reqForm.get('desPro');
    }
    get metProCli() {
        return this.reqForm.get('metProCli');
    }
    get metProUsu() {
        return this.reqForm.get('metProUsu');
    }
    get convocatoriaApli() {
        return this.aplicarForm.get('convocatoriaApli');
    }
    get startupApli() {
        return this.aplicarForm.get('startupApli');
    }
    get aplico() {
        return this.aplicarForm.get('aplico');
    }
    get porcentaje() {
        return this.aplicarForm.get('porcentaje');
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
    /**
   * Redirecciona a la pagina para crear un producto
   */
  editarInfoP() {
    localStorage.setItem('verP', 'false');
    this.router.navigateByUrl('productosStartup/new');
    }
}
