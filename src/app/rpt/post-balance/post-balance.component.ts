import { Component } from "@angular/core";
import { PostBalanceService } from "../services/post-balance.service";

@Component({
  selector: "app-post-balance",
  templateUrl: "./post-balance.component.html",
  styleUrl: "./post-balance.component.css",
})
export class PostBalanceComponent {
  years: number[] = [];
  rptYear?: number;

  constructor(private pstBalSrv: PostBalanceService) {}
}
