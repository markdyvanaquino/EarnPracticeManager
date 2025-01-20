import { Injectable } from '@angular/core';
import { User }  from './user';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import 'rxjs/Rx';

@Injectable()
export class UserService {
    constructor(private http: Http) {
        this.http = http;
    }

    private usersUrl = 'http://localhost:19103/api/users/GetUsers';  // URL to web API

    getUsers(): Observable<User[]> {
        return this.http.get(this.usersUrl)
            .map(res => <User[]> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error); // log to console 
        return Observable.throw(error.json().error || 'Server Error');
    }
}