import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { DocumentModel, MonthDocumentModel } from "../doc.model";
import { enviroment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  private apiUrl = "/api"; //enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAllDocuments(): Observable<DocumentModel[]> {
    return this.http.get<DocumentModel[]>(`${this.apiUrl}/documents`);
  }

  findAllDocumentsBy(prd: string): Observable<MonthDocumentModel[]> {
    return this.http.get<MonthDocumentModel[]>(
      `${this.apiUrl}/month-documents/${prd}`,
    );
  }

  findOneDocument(id: string): Observable<DocumentModel> {
    return this.http.get<DocumentModel>(`${this.apiUrl}/documents/${id}`).pipe(
      map((data) => {
        if (data.positions) {
          data.positions = data.positions.sort((a, b) => {
            return b.id.localeCompare(a.id);
          });
        }
        return data;
      }),
    );
  }

  updateDocument(
    id: string,
    partial: Partial<DocumentModel>,
  ): Observable<DocumentModel> {
    return this.http.patch<DocumentModel>(
      `${this.apiUrl}/documents/${id}`,
      partial,
    );
  }
  /**
  update(id: string, partial: Partial<DocumentModel>): Observable<DocumentModel> {
  return this.http.patch<DocumentModel>(`${this.apiUrl}/documents/${id}`, partial);
}
   */
}
