import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, Subject, EMPTY } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonServiceService {

  // Определение субъекта для оповещения компонентов об изменениях
  private dataUpdated = new Subject<void>();

  // Метод для оповещения компонентов об изменениях
  dataUpdated$ = this.dataUpdated.asObservable();

  results: { name: string; url: string; }[] = [];
  rest: { count: number, next: string, previous: string }[] = [];
  nextButton: string | null = null;
  prevButton: string | null = null;
  myPokemon: { pokeName: string, pokePic: string }[] = [];
  link: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private httpClient: HttpClient) {}

  fetchPokemonData = (url: string): Observable<{ pokeName: string; pokePic: string; }[]> => {
    return this.httpClient.get(url).pipe(
      switchMap((response: any) => {
        const pokemonResults = response.results as { name: string, url: string }[];
        const pokemonRest = response as { count: number, next: string, previous: string };
        if (pokemonRest.previous) {
          this.prevButton = pokemonRest.previous;
        } else {
          this.prevButton = null;
        }
  
        this.rest.push(pokemonRest);
        this.results.push(...pokemonResults);
        this.nextButton = pokemonRest.next;
        this.prevButton = pokemonRest.previous;

        console.log(this.prevButton)
  
        const requests = pokemonResults.map(pokemon => this.httpClient.get(pokemon.url));
        return forkJoin(requests).pipe(
          map((pokeResponses: any[]) => {
            const myPokemon: { pokeName: string; pokePic: string; }[] = [];
            pokeResponses.forEach(pokeResponse => {
              const pokeData = pokeResponse as { name: string, sprites: { front_default: string } };
              myPokemon.push({ pokeName: pokeData.name, pokePic: pokeData.sprites.front_default });
            });
            return myPokemon;
          })
        );
      })
    );
  }

  goNext = (): Observable<void> => {
    if (this.nextButton) {
      return this.fetchPokemonData(this.nextButton).pipe(
        map(() => {
          this.dataUpdated.next(); // Оповещение компонентов об изменениях
        })
      );
    }
    return new Observable<void>();
  }

  goPrev = (): Observable<void> => {
    if (this.prevButton) {
      console.log('Previous button clicked. Fetching data for previous page from url: ', this.prevButton)
      return this.fetchPokemonData(this.prevButton).pipe(
        map(() => {
          this.dataUpdated.next(); // Оповещение компонентов об изменениях
        })
      );
    }
    console.log("Previous button clicked but no previous url found.")
    return EMPTY; // Возвращаем пустой Observable, если нет предыдущей страницы
  }  
}

