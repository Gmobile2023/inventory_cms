import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { WeatherService } from './services/weather.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { WeatherResponse } from './models/weather.model';

describe('WeatherComponent', () => {
    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;
    let weatherService: jasmine.SpyObj<WeatherService>;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('WeatherService', ['getWeatherData']);
        
        await TestBed.configureTestingModule({
            declarations: [ WeatherComponent ],
            imports: [ HttpClientTestingModule ],
            providers: [
                { provide: WeatherService, useValue: spy }
            ]
        }).compileComponents();

        weatherService = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WeatherComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load weather data on init', () => {
        const mockWeatherData = {
            current: { temperature_2m: 20, wind_speed_10m: 5 },
            current_units: { temperature_2m: '°C', wind_speed_10m: 'km/h' }
        } as WeatherResponse;

        weatherService.getWeatherData.and.returnValue(of(mockWeatherData));
        
        fixture.detectChanges();
        
        expect(component.weatherData).toEqual(mockWeatherData);
        expect(component.loading).toBeFalse();
        expect(component.error).toBeNull();
    });

    it('should handle error when loading weather data', () => {
        weatherService.getWeatherData.and.returnValue(throwError(() => new Error('API Error')));
        
        fixture.detectChanges();
        
        expect(component.error).toBeTruthy();
        expect(component.loading).toBeFalse();
        expect(component.weatherData).toBeNull();
    });
});