import {Component, OnInit} from '@angular/core';
import {RestaurantService} from '../../services';
import {Restaurant} from '../../models';

@Component({
    selector: 'welcome-page',
    templateUrl: '/js/app/pages/welcome/welcome.page.html'
})
export class WelcomePage implements OnInit {
    // Avoid initialization code in constructor.
    // Use OnInit instead, otherwise it's not testable. That's the sole reason that OnInit even exists.
    constructor(private rs: RestaurantService) { } 

    private restaurants: Restaurant[];

    ngOnInit() {
        this.rs.getAll$().subscribe(
            res => this.restaurants = res,
            err => alert('Oh snap!')); // TODO: Provide global error notification dialog via injectable service.
    }
}