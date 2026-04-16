import { Component, OnInit } from "@angular/core";
import { PostGroupModel, PostModel, TransactionModel } from "../cat.model";
import { PostService } from "../services/post.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { EMPTY, forkJoin, Observable, switchMap, tap } from "rxjs";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrl: "./post.component.css",
})
export class PostComponent implements OnInit {
  title: string = "Positionen";

  transactions: TransactionModel[] = [];
  curTransactionId?: string;

  postGroups: PostGroupModel[] = [];
  curPostGroupId?: string;

  posts: PostModel[] = [];

  constructor(
    private pstSrv: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const taId = params["taid"];
      const pgId = params["pgid"];

      if (taId && pgId) {
        this.loadData(taId, pgId);
      } else {
        this.redirectToFirst();
      }
    });
  }

  private loadData(taId: string, pgId: string): void {
    this.curTransactionId = taId;
    this.curPostGroupId = pgId;

    forkJoin({
      transactions: this.pstSrv.findAllTransactions(), // für alle Transaktionen
      transaction: this.pstSrv.findOneTransaction(taId), // für die akt. Transaktion
    })
      .pipe(
        tap(({ transactions, transaction }) => {
          this.transactions = transactions;
          this.postGroups = transaction.postgroups ?? [];
        }),
        switchMap(() => this.pstSrv.findOnePostGroup(pgId)),
      )
      .subscribe((pg) => {
        if (pg.posts) {
          this.posts = pg.posts;
        }
      });
  }

  // ----- C L I C K - E V E N T S -----
  onChangeSelectTransactions(taId: string): void {
    this.redirectToFirst(taId);
  }

  onChangeSelectTransactionPostGroups(pgId: string): void {
    if (this.curTransactionId) {
      this.redirectTo(this.curTransactionId, pgId);
    }
  }

  // ----- N A V I G A T I O N -----
  private redirectToFirst(taId?: string): void {
    const transaction$ = taId
      ? this.pstSrv.findOneTransaction(taId) // wenn taId übergeben wurde
      : this.pstSrv.findFirstTransaction(); // wenn keinen taId übergeben wurde

    transaction$
      .pipe(
        switchMap((tr) => {
          if (!tr) return EMPTY;

          return this.pstSrv.findFirstPostGroup(String(tr.id)).pipe(
            tap((pg) => {
              if (!pg) return;

              this.redirectTo(String(tr.id), String(pg.id));
            }),
          );
        }),
      )
      .subscribe();
  }

  private redirectTo(taId: string, pgId: string): void {
    this.router.navigate([
      "/cat",
      "transaction",
      taId,
      "postgroup",
      pgId,
      "posts",
    ]);
  }
  /*
  async loadDropDownTransaktions(): Promise<void> {
    this.pstSrv.findAllTransactions().subscribe((data) => {
      this.transactions = data;

      // Pfadparameters
      this.route.params.subscribe((params: Params) => {
        const taId = params["taid"];
        const pgId = params["pgid"];

        if (taId) {
          this.curTransactionId = taId;
          this.curPostGroupId = pgId;

          this.loadDropDownPostGroups(taId);
          console.log("PostGruppenen: ", this.postGroups);

          this.loadPosts(pgId);

          console.log("Akt Transaktion: ", this.curTransactionId);
          console.log("Akt Postgruppe: ", this.curPostGroupId);
          console.log("Posten: ", this.posts);
        } else {
          //ToDo: Finde 1. und weiterleite
        }
      });
    });
  }

  async loadDropDownPostGroups(taId: string): Promise<void> {
    this.pstSrv.findOneTransaction(taId).subscribe((data) => {
      if (data.postgroups) {
        this.postGroups = data.postgroups;
      }
    });
  }

  loadPosts(pgId: string): void {
    this.pstSrv.findPostsByPostGroup(pgId).subscribe((data) => {
      this.posts = data;
    });
  }
*/

  //----- C L I C K - E V E N T S -----
  onChangeSelect(newTaId: string): void {
    //this.router.navigate(["/cat/transaction", String(newTaId), "postgroups"]);
  }
}
