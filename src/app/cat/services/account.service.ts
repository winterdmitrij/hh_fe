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

  // Accountgroups
  findAllAccountGroups(): Observable<AccountGroupModel[]> {
    return this.http.get<AccountGroupModel[]>(`${this.apiUrl}/accountgroups`);
  }

  findOneAccountGroup(id: string): Observable<AccountGroupModel> {
    return this.http
      .get<AccountGroupModel>(`${this.apiUrl}/accountgroups/${id}`)
      .pipe(
        map((data) => {
          if (data.accounts) {
            data.accounts = data.accounts.sort((a, b) => {
              if (a.rnk == null) return 1;
              if (b.rnk == null) return -1;

              return a.rnk.localeCompare(b.rnk);
            });
          }
          return data;
        }),
      );
  }

  // Die erste ist die, wessen Rang kleiner ist
  findFirstAccountGroup(): Observable<AccountGroupModel> {
    return this.findAllAccountGroups().pipe(
      map((data) => {
        if (data) {
          data = data.sort((a, b) => {
            if (a.rnk == null) return 1;
            if (b.rnk == null) return -1;

            return a.rnk.localeCompare(b.rnk);
          });
        }
        return data[0];
      }),
    );
  }

  createNewAccountGroup(
    accountGroup: AccountGroupModel,
  ): Observable<AccountGroupModel> {
    return this.http.post<AccountGroupModel>(
      `${this.apiUrl}/accountgroups`,
      accountGroup,
    );
  }

  updateAccountGroup(
    id: number,
    partial: Partial<AccountGroupModel>,
  ): Observable<AccountGroupModel> {
    return this.http.patch<AccountGroupModel>(
      `${this.apiUrl}/accountgroups/${id}`,
      partial,
    );
  }

  deleteAccountGroup(accountGroup: AccountGroupModel): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/accountgroups/${accountGroup.id}`,
    );
  }

  // Accounts
  //ToDo: löschen?
  // - findOnePostGroup ist besser
  // - In position-form wird benutzt
  findAllAccounts(): Observable<AccountModel[]> {
    return this.http.get<AccountModel[]>(`${this.apiUrl}/accounts`);
  }

  /* 
  findOneAccount(id: string): Observable<AccountModel> {
    return this.http.get<AccountModel>(`${this.apiUrl}/accounts/${id}`);
  }
*/

  createNewAccount(account: AccountModel): Observable<AccountModel> {
    return this.http.post<AccountModel>(`${this.apiUrl}/accounts`, account);
  }

  updateAccount(
    id: number,
    partial: Partial<AccountModel>,
  ): Observable<AccountModel> {
    return this.http.patch<AccountModel>(
      `${this.apiUrl}/accounts/${id}`,
      partial,
    );
  }

  deleteAccount(account: AccountModel): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/accounts/${account.id}`);
  }
}
