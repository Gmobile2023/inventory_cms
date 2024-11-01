import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'createInventoryModal',
    templateUrl: './create-inventory-modal.component.html',
})
export class CreateInventoryModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createModal', { static: true }) modal: ModalDirective;

    constructor(injector: Injector) {
        super(injector);
    }

    active = false;
    saving = false;
    cities: City[];
    selectedCities: City[];

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
        ];
    }

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
