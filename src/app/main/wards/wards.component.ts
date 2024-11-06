import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './wards.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class WardsComponent extends AppComponentBase {
    constructor(injector: Injector, private modalService: BsModalService) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    modalRef?: BsModalRef | null;

    ngOnInit() {
        this.items = [{ label: 'Quản lý Phường/Xã' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }

    dataSimFake = [
        {
            ma: '1212',
            name: 'xã Nhân Chính',
            status: true,
            country: 'huyện Lý Nhân',
        },
        {
            ma: '1213',
            name: 'xã Nhân Khang',
            status: true,
            country: 'huyện Lý Nhân',
        },
        {
            ma: '1214',
            name: 'xã Nhân Nghĩa',
            status: false,
            country: 'huyện Lý Nhân',
        },
    ];
}
