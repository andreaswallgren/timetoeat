import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { FORM_PROVIDERS } from '@angular/common';

import { AppComponent } from './app.component';

// Import our services here
import { RestaurantService } from './services';


bootstrap(AppComponent, [
    // APP_ROUTER_PROVIDERS,
    FORM_PROVIDERS,
    HTTP_PROVIDERS,

    // Bootstrap our singleton services here    
    RestaurantService
])
.catch(err => console.error(err));