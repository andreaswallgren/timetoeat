import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

import {Restaurant} from '../models';

@Injectable()
export class RestaurantService {
    private baseUrl = '/api/restaurant/';

    constructor(private http: Http) {
    }

    // Tip: $ is used as suffix to denote observable return types. 
    // While any form of notation is generally a no-no, this is considered 'best practice' in the Angular community.
    public getAll$(): Observable<Restaurant[]> {
        return this.http.get(this.baseUrl)
            .timeout(5000)
            .retry(3)
            .map(res => <Restaurant[]>res.json());
    }
}