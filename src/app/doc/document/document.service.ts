import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentModel } from "../doc.model";
import { enviroment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<DocumentModel[]> {
    return this.http.get<DocumentModel[]>(`${this.apiUrl}/documents`);
  }
}
