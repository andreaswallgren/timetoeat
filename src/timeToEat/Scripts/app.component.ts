import { Component } from '@angular/core';
import { WelcomePage } from './pages';

@Component({
    selector: 'eat-me',
    directives: [WelcomePage],
    // TODO: Replace with routing to pages instead
    template: `
<app-content>
    <welcome-page></welcome-page>
</app-content>
    `
})
export class AppComponent {
    constructor() { }        
}