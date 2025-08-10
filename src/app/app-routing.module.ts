import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },

  {
    path: "home",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "cat",
    loadChildren: () => import("./cat/cat.module").then((m) => m.CatModule),
  },
  {
    path: "doc",
    loadChildren: () => import("./doc/doc.module").then((m) => m.DocModule),
  },
  {
    path: "rpt",
    loadChildren: () => import("./rpt/rpt.module").then((m) => m.RptModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
