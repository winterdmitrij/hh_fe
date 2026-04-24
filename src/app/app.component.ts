import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { enviroment } from "../enviroments/enviroment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "hh_fe";
  //  private apiUrl = enviroment.apiUrl;

  envName = enviroment.envName;

  constructor(private router: Router) {}

  isBootonActive(urlBeg: string): boolean {
    //  console.log("URL: ", this.apiUrl);
    return this.router.url.startsWith(urlBeg);
  }
}
