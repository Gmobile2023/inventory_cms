import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherResponse } from './models/weather.model';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class WeatherComponent extends AppComponentBase implements OnInit {
    weatherData: WeatherResponse | null = null;
    loading = false;
    error: string | null = null;

    private viewContainerRef: ViewContainerRef;

    public constructor(
        injector: Injector,
        private weatherService: WeatherService,
        viewContainerRef: ViewContainerRef
    ) {
        super(injector);

        this.viewContainerRef = viewContainerRef;
    }

    ngOnInit() {
        this.getWeatherData();
    }

    getWeatherData() {
        this.loading = true;
        this.error = null;

        this.weatherService.getWeatherData(21.03, 105.81)
            .pipe(
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (response) => {
                    this.weatherData = response;
                },
                error: (error) => {
                    this.error = 'Failed to load weather data. Please try again later.';
                    console.error('Weather API Error:', error);
                }
            });
    }
}