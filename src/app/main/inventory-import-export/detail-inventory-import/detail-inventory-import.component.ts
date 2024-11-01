import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './detail-inventory-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryImportComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector, private modalService: BsModalService) {
        super(injector);
    }
    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;

    ngOnInit(): void {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Chi tiết yêu cầu nhập kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
    dataFake = [
        {
            id: 1,
            loai: 'SIM',
            ma: 'MLOAD_64K',
            ten: 'MLOAD_64K',
            donvi: 'Cái',
            quantity: 1000,
            to: '898407210016823000',
            from: '898407210016824000',
        },
        {
            id: 2,
            loai: 'SIM',
            ma: 'MLOAD_54K',
            ten: 'MLOAD_54K',
            donvi: 'Cái',
            quantity: 1000,
            to: '898407210016823000',
            from: '898407210016824000',
        },
    ];
    dataHistoryFake = [
        {
            id: 1,
            action: 'Tạo yêu cầu',
            noidung: 'Tạo yêu cầu nhập kho',
            date: '12/10/2024 08:23',
            user: 'Nguyễn Văn Chung',
        },
        {
            id: 2,
            action: 'Tạo yêu cầu',
            noidung: 'Tạo yêu cầu nhập kho',
            date: '12/10/2024 08:23',
            user: 'Nguyễn Văn Chung',
        },
    ];
}
