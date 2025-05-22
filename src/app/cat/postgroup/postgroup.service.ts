import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PostGroupModel, TransactionModel } from "../cat.model";
import { enviroment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class PostgroupService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<PostGroupModel[]> {
    return this.http.get<PostGroupModel[]>(`${this.apiUrl}/postgroups`);
  }

  findOne(id: string): Observable<PostGroupModel> {
    return this.http.get<PostGroupModel>(`${this.apiUrl}/postgroups/${id}`);
  }

  //ToDo: Löschen
  findAllPstGrpByTra(id: string): Observable<TransactionModel> {
    return this.http.get<TransactionModel>(`${this.apiUrl}/transactions/${id}`);
  }
}
