import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PostGroupModel, PostModel, TransactionModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private apiUrl = "/api"; //enviroment.apiUrl;

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
    return this.http
      .get<PostGroupModel>(`${this.apiUrl}/postgroups/${id}`)
      .pipe(
        map((data) => {
          if (data.posts) {
            data.posts = data.posts.sort((a, b) => {
              if (a.rnk == null) return 1;
              if (b.rnk == null) return -1;

              return a.rnk.localeCompare(b.rnk);
            });
          }
          return data;
        }),
      );
  }

  findFirstPostGroup(taId: string): Observable<PostGroupModel | undefined> {
    return this.findOneTransaction(taId).pipe(
      map((data) => {
        const postGroups = data.postgroups ?? [];

        return [...postGroups][0];
      }),
    );
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

  deletePostGroup(postGroup: PostGroupModel): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/postgroups/${postGroup.id}`);
  }

  // Posts
  //ToDo: löschen?
  // - findOnePostGroup ist besser
  // - In position-form wird benutzt
  findAllPosts(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.apiUrl}/posts`);
  }

  createNewPost(post: PostModel): Observable<PostModel> {
    return this.http.post<PostModel>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, partial: Partial<PostModel>): Observable<PostModel> {
    return this.http.patch<PostModel>(`${this.apiUrl}/posts/${id}`, partial);
  }

  deletePost(post: PostModel): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${post.id}`);
  }
}
