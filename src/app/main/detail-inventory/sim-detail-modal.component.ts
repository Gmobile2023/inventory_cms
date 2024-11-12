import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'simDetailModal',
    templateUrl: './sim-detail-modal.component.html',
})
export class SimDetailModalComponent extends AppComponentBase {
    @ViewChild('createModal', { static: true }) modal: ModalDirective;

    constructor(injector: Injector) {
        super(injector);
    }

    active = false;
    saving = false;

    show() {
        this.active = true;
        this.modal.show();
    }
    close() {
        this.modal.hide();
    }
    onShown() {
        console.log('Show');
    }
    save() {
        console.log('Save');
    }
}
