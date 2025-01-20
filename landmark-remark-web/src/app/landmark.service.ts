import { Injectable } from '@angular/core';
import { Landmark }  from './landmark';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import 'rxjs/Rx';

@Injectable()
export class LandmarkService {
    public headers: Headers;
    postResponse: any;

    constructor(private http: Http) { //inject http module for backend calls
        this.http = http;
    }

    private landmarksUrl = 'http://localhost:19103/api/landmarks/';  // URL to web API

    addLandmark(landmark: Landmark): Observable<Landmark> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this.http.post(this.landmarksUrl + 'Postlandmark/',
            JSON.stringify(landmark),
           { headers: headers, method: "post"})
            .map(res => <Landmark>res.json())
            .catch(this.handleError);
    }

    getAllLandmarks(searchStr: string): Observable<Landmark[]> {
        var params = new URLSearchParams();
        params.set('searchStr', searchStr);
        return this.http.get(this.landmarksUrl + 'Getlandmarks', { search: params })
            .map(res => <Landmark[]> res.json())
            .catch(this.handleError);
    }

    getUserLandmarks(userId: number): Observable<Landmark[]> {
        var params = new URLSearchParams();
        params.set('userId', userId.toString());
        return this.http.get(this.landmarksUrl + 'GetUserLandmarks', { search: params })
            .map(res => <Landmark[]>res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error); // log to console 
        return Observable.throw(error.json().error || 'Server Error');
    }

}