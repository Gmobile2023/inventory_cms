import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './detail-inventory-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryExportComponent extends AppComponentBase implements OnInit {
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
            { label: 'Chi tiết yêu cầu xuất kho' },
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
            ten: 'Đợt 1 xuất SIM',
            type: 'SIM',
            quantity: '1.000',
            created_at: '20/10/2024 10:12',
            status: 1,
            status_ht: 1,
            approval_date: '25/10/2024 10:12',
        },
        {
            id: 2,
            ten: 'Đợt 2 xuất SIM',
            type: 'SIM',
            quantity: '1.000',
            created_at: '20/10/2024 10:12',
            status: 1,
            status_ht: 1,
            approval_date: '25/10/2024 10:12',
        },
        {
            id: 3,
            ten: 'Đợt 3 xuất SIM',
            type: 'SIM',
            quantity: '1.000',
            created_at: '20/10/2024 10:12',
            status: 0,
            status_ht: 0,
            approval_date: '25/10/2024 10:12',
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
