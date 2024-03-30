import { Component, OnInit } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})

export class PokemonsComponent implements OnInit {

  pokemons: { pokeName: string; pokePic: string; }[] = [];
  link: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private pokemonService: PokemonServiceService) {}

  ngOnInit(): void {
    this.fetchData(this.link); // Используем начальный URL-адрес при инициализации компонента
  }

  fetchData(url: string) {
    this.pokemonService.fetchPokemonData(url).subscribe(pokemonData => {
      this.pokemons = pokemonData;
    });
  }

  onClickNext() {
    this.pokemonService.goNext().subscribe(() => {
      if (this.pokemonService.nextButton !== null) {
        this.fetchData(this.pokemonService.nextButton!); // Используем переменную nextButton
      }
    });
  }
  
  onClickPrev() {
    console.log("Previous button clicked"); // Отладочный вывод
    if (this.pokemonService.prevButton !== null) {
      this.pokemonService.goPrev().subscribe(() => {
        console.log("Previous data fetched"); // Отладочный вывод
        this.fetchData(this.pokemonService.prevButton!); // Используем переменную prevButton
      });
    }
  }
  
  
}
