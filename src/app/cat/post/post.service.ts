import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PostModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.apiUrl}/posts`);
  }
}
