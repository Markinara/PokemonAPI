import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PokemonServiceService {

  results: { name: string; url: string; }[] = []
  rest: { count: number, next: string, prev: string }[] = []
  nextButton: string | null = null;
  prevButton: string | null = null;
  myPokemon: { pokeName: string, pokePic: string }[] = [];
  link: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private httpClient: HttpClient) {
    // this.httpClient.get(this.link)
    //   .subscribe(response => {
    //     const pokemonResults = response as { results: { name: string, url: string }[] }
    //     const pokemonRest = response as { count: number, next: string, prev: string }
    //     this.rest.push(pokemonRest)
    //     this.results.push(...pokemonResults.results);
    //     console.log(this.results);
    //     this.nextButton = pokemonRest.next
    //     this.prevButton = pokemonRest.prev

    //     for (const pokemon of this.results) {
    //       this.httpClient.get(pokemon.url)
    //         .subscribe(response => {
    //           const pokeData = response as { name: string, sprites: { front_default: string } }
    //           this.myPokemon.push({ pokeName: pokeData.name, pokePic: pokeData.sprites.front_default })
    //         });
    //     }
    //   });
  }

  fetchPokemonData(url: string) {
    this.httpClient.get(url)
      .subscribe(response => {
        const pokemonResults = response as { results: { name: string, url: string }[] }
        const pokemonRest = response as { count: number, next: string, prev: string }
        this.rest.push(pokemonRest)
        this.results.push(...pokemonResults.results);
        this.nextButton = pokemonRest.next
        this.prevButton = pokemonRest.prev

        for (const pokemon of this.results) {
          this.httpClient.get(pokemon.url)
            .subscribe(response => {
              const pokeData = response as { name: string, sprites: { front_default: string } }
              this.myPokemon.push({ pokeName: pokeData.name, pokePic: pokeData.sprites.front_default })
            });
        }
        console.log(this.myPokemon)
        return this.myPokemon
      });

  }


  goNext = () => {
    if (this.nextButton) {
      this.fetchPokemonData(this.nextButton);
    }
  }

  goPrev = () => {
    if (this.prevButton) {
      this.fetchPokemonData(this.prevButton);
    }
  }
}


