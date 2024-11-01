﻿import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: 'dashboard',
                        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
                        data: { permission: 'Pages.Tenant.Dashboard' },
                    },
                    {
                        path: 'inventory-manager',
                        loadChildren: () => import('./inventory/inventory.module').then((m) => m.InventoryModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-manager/detail-inventory',
                        loadChildren: () =>
                            import('./detail-inventory/detail-inventory.module').then((m) => m.DetailInventoryModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-manager/action-history',
                        loadChildren: () =>
                            import('./action-history/action-history.module').then((m) => m.ActionHistoryModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-import-export',
                        loadChildren: () =>
                            import('./inventory-import-export/inventory-import-export.module').then(
                                (m) => m.InventoryImportExportModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-import-export/create-inventory-import',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/create-inventory-import/create-inventory-import.module'
                            ).then((m) => m.CreateInventoryImportModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-import-export/detail-inventory-import',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/detail-inventory-import/detail-inventory-import.module'
                            ).then((m) => m.DetailInventoryImportModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-import-export/create-inventory-export',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/create-inventory-export/create-inventory-export.module'
                            ).then((m) => m.CreateInventoryExportModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-import-export/detail-inventory-export',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/detail-inventory-export/detail-inventory-export.module'
                            ).then((m) => m.DetailInventoryExportModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'inventory-report',
                        loadChildren: () =>
                            import('./inventory-report/inventory-report.module').then((m) => m.InventoryReportModule),
                        data: { permission: '' },
                    },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' },
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MainRoutingModule {}
