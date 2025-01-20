import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { CreateOrderDto, InventoryServiceProxy, IOrderItem, OrderItem } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
@Component({
    templateUrl: './create-inventory-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryImportComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private router: Router,
        private _httpClient: HttpClient
    ) {
        super(injector);
    }

    uploadedFiles: any[] = [];
    items: MenuItem[];
    home: MenuItem;
    dataFake = [{ id: 1 }];
    indexData: number = 1;
    value: number = 0;
    title: string | undefined;
    description: string | undefined;
    stockId: number;
    productType: number = 2;
    listStock = [];
    tempOrderItems: IOrderItem[] = [
        {
            orderName: '',
            unit: '',
            attribute: '',
            telCo: 'Bộ',
            fromRange: '',
            toRange: '',
            quantity: 0,
        },
    ];
    selectedStock: any;
    uploadedFile: File | null = null;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    isLoading: boolean = false;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu nhập kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getListStock();
    }

    getListStock() {
        this._inventoryServiceProxy
            .getListStock(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                0,
                99
            )
            .subscribe((result) => {
                this.listStock = result.items;
            });
    }

    onFileSelect(event: any): void {
        const file = event.files && event.files[0];
        if (file) {
            this.uploadedFile = file;
        }
    }

    createOrder() {
        this.isLoading = true;
        const body = new CreateOrderDto();
        if (this.selectedStock) {
            body.stockId = this.selectedStock.id;
        }
        body.title = this.title;
        body.description = this.description;
        body.productType = this.productType;
        if (this.tempOrderItems) {
            body.items = this.tempOrderItems.map((item) => {
                return OrderItem.fromJS(item);
            });
        }
        if (this.uploadedFile) {
            this._inventoryServiceProxy
                .createOrder(body)
                .pipe(
                    catchError((err) => {
                        this.isLoading = false;
                        throw err;
                    })
                )
                .subscribe({
                    next: (result) => {
                        this.isLoading = false;
                        if (result.orderCode) {
                            this.uploadOrderDocument(result.orderCode, this.uploadedFile);
                        }
                    },
                    error: (err) => {
                        this.isLoading = false;
                    },
                });
        } else {
            this.isLoading = false;
            this.message.error(this.l('Vui lòng tải lên thông tin chứng từ!'));
        }
    }

    uploadOrderDocument(orderCode: string, file: File) {
        const uploadUrl = `${this.remoteServiceBaseUrl}/api/services/app/Inventory/UploadOrderDocument`;
        const formData = new FormData();
        formData.append('orderCode', orderCode);
        formData.append('file', file);
        this._httpClient.post<any>(uploadUrl, formData).subscribe({
            next: (response) => {
                if (response.success) {
                    this.router.navigate(['/app/main/inventory-import-export']);
                    this.notify.info(this.l('Tạo yêu cầu nhập kho thành công'));
                }
            },
            error: (err) => {
                this.message.error(this.l(err.error.error?.message));
            },
        });
    }

    addRow() {
        this.tempOrderItems.push({
            orderName: '',
            unit: '',
            attribute: '',
            telCo: 'Bộ',
            fromRange: '',
            toRange: '',
            quantity: 0,
        });
    }

    onKeyPress(event: KeyboardEvent): void {
        const regex = /^[0-9]*$/; // Chỉ cho phép nhập số
        if (!regex.test(event.key)) {
            event.preventDefault(); // Chặn ký tự không hợp lệ
        }
    }

    onInput(event: Event, record: IOrderItem): void {
        const input = event.target as HTMLInputElement;

        // Remove non-numeric characters
        input.value = input.value.replace(/[^0-9]/g, '');

        // Update corresponding property
        if (input === document.activeElement) {
            record.fromRange = input.name === 'fromRange' ? input.value : record.fromRange;
            record.toRange = input.name === 'toRange' ? input.value : record.toRange;
        }

        // Perform calculation
        if (record.fromRange && record.toRange) {
            try {
                const fromRange = BigInt(record.fromRange);
                const toRange = BigInt(record.toRange);

                // Valid range, calculate quantity
                if (fromRange <= toRange) {
                    record.quantity = Number(toRange - fromRange + BigInt(1));
                } else {
                    record.quantity = 0; // Invalid range
                }
            } catch {
                record.quantity = 0; // Reset if there's an error
            }
        } else {
            record.quantity = 0;
        }
    }

    onChangeTelco(record: IOrderItem): void {
        if (record.telCo === 'Cái') {
            record.toRange = '';
        }
    }

    removeRow(index: number): void {
        if (this.tempOrderItems.length > 1) {
            this.tempOrderItems.splice(index, 1);
        } else {
            // Thông báo cho người dùng nếu muốn
            console.warn('Không thể xóa.');
        }
    }

    onBasicUploadAuto(event) {
        console.log('Upload success');
    }

    onUpload(event) {}
}
