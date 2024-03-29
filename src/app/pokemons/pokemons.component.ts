import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PokemonServiceService } from '../pokemon-service.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})

export class PokemonsComponent {

  pokemons: { pokeName: string; pokePic: string; }[] = [];

  constructor(private httpClient: HttpClient, private pokemonService: PokemonServiceService) {
    pokemonService.fetchPokemonData('https://pokeapi.co/api/v2/pokemon')
  }

   onClickNext = () => {
      this.pokemonService.goNext() ;
  }
  
  onClickPrev = () => {
    this.pokemonService.goPrev();
}
}

