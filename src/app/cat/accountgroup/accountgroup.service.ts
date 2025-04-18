import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AccountGroupModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class AccountgroupService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<AccountGroupModel[]> {
    return this.http.get<AccountGroupModel[]>(`${this.apiUrl}/accountgroups`);
  }

  findOne(id: string): Observable<AccountGroupModel> {
    return this.http.get<AccountGroupModel>(
      `${this.apiUrl}/accountgroups/${id}`
    );
  }
}
