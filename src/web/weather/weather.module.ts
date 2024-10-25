import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { WeatherComponent } from './weather.component';
import { WeatherService } from './services/weather.service';
import { WeatherRoutingModule } from './weather-routing.module';
import { FormsModule } from '@node_modules/@angular/forms';
import { AbpZeroTemplateCommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        AbpZeroTemplateCommonModule,
        UtilsModule,
        WeatherRoutingModule
    ],
    declarations: [WeatherComponent],
    providers: [
        WeatherService
    ],
})

export class WeatherModule { }