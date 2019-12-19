import {Directive, Input} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
    selector: '[disableControl]'
})
export class DisableControlDirectiveDirective {
    /**
     * Desabilita un componente
     * @param {boolean} condition para desabilitar
     */
    @Input() set disableControl( condition: boolean ) {
        const action = condition ? 'disable' : 'enable';
        this.ngControl.control[action]();
    }

    constructor( private ngControl: NgControl ) {
    }

}