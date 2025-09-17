import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent implements OnInit {
  languages: Array<{code: string, name: string, flag: string}> = [];
  currentLanguage: string = 'en';

  constructor(private i18nService: I18nService) {
    this.languages = this.i18nService.getAvailableLanguages();
  }

  ngOnInit() {
    this.i18nService.loadSavedLanguage();
    this.i18nService.currentLang$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  onLanguageChange(languageCode: any) {
    if (typeof languageCode === 'string') {
      this.i18nService.setLanguage(languageCode);
    }
  }
}
