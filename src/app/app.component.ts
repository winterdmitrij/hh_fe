import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "hh_fe";

  constructor(private router: Router) {}

  isBootonActive(urlBeg: string): boolean {
    return this.router.url.startsWith(urlBeg);
  }
}
