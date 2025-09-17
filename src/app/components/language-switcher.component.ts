import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  template: `
    <div class="language-switcher">
      <p-select
        [options]="languages"
        [ngModel]="currentLanguage"
        (ngModelChange)="onLanguageChange($event)"
        optionLabel="name"
        optionValue="code"
        [showClear]="false"
        styleClass="language-select">
        <ng-template pTemplate="selectedItem" let-option>
          <div class="selected-language" *ngIf="option">
            <span class="flag">{{ option.flag }}</span>
            <span class="name">{{ option.name }}</span>
          </div>
        </ng-template>
        <ng-template pTemplate="item" let-option>
          <div class="language-option">
            <span class="flag">{{ option.flag }}</span>
            <span class="name">{{ option.name }}</span>
          </div>
        </ng-template>
      </p-select>
    </div>
  `,
  styles: [`
    .language-switcher {
      min-width: 120px;
    }

    ::ng-deep .language-select {
      min-width: 120px;
    }

    ::ng-deep .language-select .p-select-label {
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    ::ng-deep .language-select:not(.p-disabled):hover .p-select-label {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
    }

    ::ng-deep .language-select.p-select-focused .p-select-label {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    }

    .selected-language,
    .language-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .flag {
      font-size: 1.2rem;
    }

    .name {
      font-size: 0.9rem;
      font-weight: 500;
    }

    ::ng-deep .language-select .p-select-overlay {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    ::ng-deep .language-select .p-select-overlay .p-select-option {
      color: #333;
      padding: 0.75rem;
      transition: all 0.2s ease;
    }

    ::ng-deep .language-select .p-select-overlay .p-select-option:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    ::ng-deep .language-select .p-select-overlay .p-select-option.p-selected {
      background: rgba(59, 130, 246, 0.2);
      color: #1d4ed8;
    }
  `]
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
