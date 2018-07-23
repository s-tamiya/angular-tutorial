import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getHeroes(): Observable<Hero[]> {
      this.log('fetched heroes');
      // return of(HEROES);
      return this.http.get<Hero[]>(this.heroesUrl)
          .pipe(
            tap(heroes => this.log('fetch heroes')),
            catchError(this.handleError('getHeroes', []))
          );
  }

  getHero(id: number): Observable<Hero> {
    //this.messageService.add(`HeroService: fetched hero id=${id}`);
    const url = `${this.heroesUrl}/${id}`;
    this.log(`fetched hero id=${id}`);
    //return of(HEROES.find(hero => hero.id === id));
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetch hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  private log(message: String) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); //代りにコンソールに出力

      // TODO ユーザーへの開示のため、エラーの変換処理を改善する
      this.log(`${operation} faild: ${error.message}`);

      // 空の結果を返してアプリを継続可能にする
      return of(result as T);
    };
  }

  updateHero(hero: Hero): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }
}
