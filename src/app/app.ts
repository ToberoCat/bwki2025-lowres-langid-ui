import {Component} from '@angular/core';
import {LanguageClassifierComponent} from './components/language-classifier.component';
import {LanguageSwitcherComponent} from './components/language-switcher.component';
import {TranslatePipe} from './pipes/translate.pipe';

@Component({
  selector: 'app-root',
  imports: [LanguageClassifierComponent, LanguageSwitcherComponent, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
