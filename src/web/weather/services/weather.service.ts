import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../models/weather.model';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private readonly apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = '/api/weather';
    }

    getWeatherData(latitude: number, longitude: number): Observable<WeatherResponse> {
        const params = new HttpParams()
            .set('latitude', latitude.toString())
            .set('longitude', longitude.toString())
            .set('current', 'temperature_2m,wind_speed_10m')
            .set('hourly', 'temperature_2m,relative_humidity_2m,wind_speed_10m');

        return this.http.get<WeatherResponse>(this.apiUrl, { params });
    }
}