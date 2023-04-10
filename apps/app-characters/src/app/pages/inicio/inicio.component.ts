import { Characters, Result } from './../interfaces/responseR&M';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  Inject,
  OnInit,
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Info } from '../interfaces/responseR&M';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CharacterService } from '../../services/rick-and-morty.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'bb-test-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CharacterService],
})
export class InicioComponent implements OnInit {
  showFavorites = false;
  characters: Result[] = [];
  page = 1;
  info: Info[] = [];
  nResults = 0;
  showButton = false;
  filteredCharactersByCategory: any[] = [];
  term = '';
  selectedCategory: any;
  categories = ['Alive', 'Dead', 'Unknown'];
  favorites: Result[] = [];
  constructor(
    private rm: CharacterService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.getCharactersM();
  }
  @HostListener('window:scroll')
  onWindowScroll() {
    const yOffSet = window.pageXOffset;
    const scrollTop = this.document.documentElement.scrollTop;
    this.showButton = (yOffSet || scrollTop) > 200;
  }
  onScrollTop() {
    this.document.documentElement.scrollTop = 0;
  }
  onScrollDown() {
    this.page = this.page + 1;
    this.rm.getCharacters(this.page).subscribe({
      next: (res) => {
        console.log(this.page);
        this.characters.push(...res['results']);

        console.log(this.characters);
      },
    });
  }
  getCharactersM() {
    this.rm.getCharacters(this.page).subscribe((response) => {
      console.log(response);
      this.characters = response['results'];
      this.nResults = this.characters.length;
      console.log(this.characters);
    });
  }

  onSearch() {
    this.characters = this.characters.filter((character) => {
      return character.name.toLowerCase().includes(this.term.toLowerCase());
    });
    this.onFilter();
  }

  onFilter() {
    console.log('Categori', this.selectedCategory);
    if (this.selectedCategory) {
      this.characters = this.characters.filter((character) => {
        return character.status === this.selectedCategory;
      });
    } else {
      this.filteredCharactersByCategory = this.characters;
    }
  }

  toggleFavorite(character: Result) {
    this.favorites.push(character);
  }
  deleteFavorite(character: Result) {
    const index = this.favorites.findIndex(
      (favorite) => favorite.id === character.id
    );
    this.favorites.splice(index, 1);
  }
  isFavorite(character: Result) {
    return (
      this.favorites.findIndex((favorite) => favorite.id === character.id) >= 0
    );
  }
  getFavorites() {
    this.showFavorites = !this.showFavorites;
  }
}
