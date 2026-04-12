import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PostGroupModel, PostModel, TransactionModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  // Transactions
  findAllTransactions(): Observable<TransactionModel[]> {
    return this.http.get<TransactionModel[]>(`${this.apiUrl}/transactions`);
  }

  findOneTransaction(id: string): Observable<TransactionModel> {
    return this.http
      .get<TransactionModel>(`${this.apiUrl}/transactions/${id}`)
      .pipe(
        map((data) => {
          if (data.postgroups) {
            data.postgroups = data.postgroups.sort((a, b) => {
              if (a.rnk == null) return 1;
              if (b.rnk == null) return -1;

              return a.rnk.localeCompare(b.rnk);
            });
          }
          return data;
        }),
      );
  }

  findFirstTransaction(): Observable<TransactionModel> {
    return this.findAllTransactions().pipe(
      map((transactions) => transactions.sort((a, b) => a.id - b.id)[0]),
    );
  }

  // Postgroups
  findAllPostGroups(): Observable<PostGroupModel[]> {
    return this.http.get<PostGroupModel[]>(`${this.apiUrl}/postgroups`);
  }

  findOnePostGroup(id: string): Observable<PostGroupModel> {
    return this.http.get<PostGroupModel>(`${this.apiUrl}/postgroups/${id}`);
  }

  createNewPostGroup(postGroup: PostGroupModel): Observable<PostGroupModel> {
    return this.http.post<PostGroupModel>(
      `${this.apiUrl}/postgroups`,
      postGroup,
    );
  }

  updatePostGroup(
    id: number,
    partial: Partial<PostGroupModel>,
  ): Observable<PostGroupModel> {
    return this.http.patch<PostGroupModel>(
      `${this.apiUrl}/postgroups/${id}`,
      partial,
    );
  }
  /*
  findFirstPostGroup(taId: string): Observable<PostGroupModel> {
    return //this.find
  }
*/
  // Posts
  findAll(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.apiUrl}/posts`);
  }
}
