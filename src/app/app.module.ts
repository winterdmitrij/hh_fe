import { LOCALE_ID, NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { CatModule } from "./cat/cat.module";
import { DocModule } from "./doc/doc.module";
import { HomeModule } from "./home/home.module";

import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";

registerLocaleData(localeDe);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CatModule,
    DocModule,
    HomeModule,
  ],
  exports: [CatModule],
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" },
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
