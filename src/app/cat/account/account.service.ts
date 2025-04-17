import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AccountModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<AccountModel[]> {
    return this.http.get<AccountModel[]>(`${this.apiUrl}/accounts`);
  }
}
