import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentModel } from "../doc.model";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  findAll(): Observable<DocumentModel[]> {
    return this.http.get<DocumentModel[]>(`${this.apiUrl}/documents`);
  }
}
