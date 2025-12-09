import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { AccountGroupModel, AccountModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAllGroups(): Observable<AccountGroupModel[]> {
    return this.http.get<AccountGroupModel[]>(`${this.apiUrl}/accountgroups`);
  }

  findOneGroup(id: string): Observable<AccountGroupModel> {
    return this.http.get<AccountGroupModel>(
      `${this.apiUrl}/accountgroups/${id}`
    );
  }

  findFirstGroup(): Observable<AccountGroupModel> {
    return this.findAllGroups().pipe(
      map((groups) => groups.sort((a, b) => a.id - b.id)[0])
    );
  }

  findAllAccounts(): Observable<AccountModel[]> {
    return this.http.get<AccountModel[]>(`${this.apiUrl}/accounts`);
  }
}
