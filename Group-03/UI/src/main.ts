import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';  //used for web browser only

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
