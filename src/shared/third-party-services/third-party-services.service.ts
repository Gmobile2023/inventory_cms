import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConsts } from '@shared/AppConsts';

@Injectable({
    providedIn: 'root'
})
export class ThirdPartyService {
    private apiBaseUrl = AppConsts.remoteServiceBaseUrl;

    constructor(
        private http: HttpClient
    ) { }

    // Helper method to create headers
    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        
        // headers = headers.set('API-Key', 'your-api-key');
        
        return headers;
    }

    // Example GET method
    getData(endpoint: string, params?: any): Observable<any> {
        const options = {
            headers: this.getHeaders(),
            params: params
        };

        return this.http.get(`${this.apiBaseUrl}/${endpoint}`, options);
    }

    // Example POST method
    postData(endpoint: string, body: any): Observable<any> {
        const options = {
            headers: this.getHeaders()
        };

        return this.http.post(`${this.apiBaseUrl}/${endpoint}`, body, options);
    }

    // Example PUT method
    putData(endpoint: string, body: any): Observable<any> {
        const options = {
            headers: this.getHeaders()
        };

        return this.http.put(`${this.apiBaseUrl}/${endpoint}`, body, options);
    }

    // Example DELETE method
    deleteData(endpoint: string): Observable<any> {
        const options = {
            headers: this.getHeaders()
        };

        return this.http.delete(`${this.apiBaseUrl}/${endpoint}`, options);
    }
}