import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdmService} from '../services/adm.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  /**
   * Metodo constructor
   * @param {Router} router perimite redirigirse a otra vista
   */
  constructor(private router: Router,private admService: AdmService) { }

  ngOnInit() {
  }

  /**
   * Redirecciona a la vista de logeo del administrador
   */
  adm() {
      this.router.navigateByUrl('/login/adm');
  }
  /**
   * Redirecciona a la vista de logeo de la startup
   */
  startup() {
      this.router.navigateByUrl('/login/startup');
  }
  /**
   * Redirecciona a la vista de logeo de la entidad
   */
  entidad() {
      this.router.navigateByUrl('/login/entidad');
  }
  
}
