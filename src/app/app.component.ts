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

  envName = enviroment.envName;
  isProdEnv: boolean = enviroment.envName === "prod";

  constructor(private router: Router) {}

  isBootonActive(urlBeg: string): boolean {
    return this.router.url.startsWith(urlBeg);
  }
}
