import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLang = new BehaviorSubject<string>('en');
  public currentLang$ = this.currentLang.asObservable();

  private translations: { [lang: string]: Translations } = {
    en: {
      // Header
      'app.title': 'Sprachidentifikation seltener Sprachen',
      'app.subtitle': 'Advanced AI-powered language identification for rare and low-resource languages',
      'header.language': 'Language',

      // Main interface
      'input.placeholder': 'Enter or paste text here to identify its language...',
      'input.examples': 'Try examples',
      'button.classify': 'Detect Language',
      'button.clear': 'Clear',
      'button.copy': 'Copy Result',

      // Results
      'results.title': 'Detection Results',
      'results.confidence': 'Confidence',
      'results.language': 'Language',
      'results.probability': 'Probability',
      'results.noResults': 'No results to display',
      'results.topResult': 'Most likely language',

      // Settings
      'settings.title': 'Settings',
      'settings.backend_url': 'Backend URL',
      'settings.backend_url.placeholder': 'Enter backend URL',
      'settings.provider': 'AI Model Provider',
      'settings.provider.placeholder': 'Select a provider',
      'settings.languages': 'languages supported',
      'settings.version': 'Version',

      // Examples
      'examples.title': 'Try these examples',
      'examples.english': 'Hello, how are you today?',
      'examples.german': 'Hallo, wie geht es dir heute?',
      'examples.spanish': 'Hola, ¿cómo estás hoy?',
      'examples.french': 'Bonjour, comment allez-vous aujourd\'hui?',
      'examples.italian': 'Ciao, come stai oggi?',

      // About
      'about.title': 'About BwKi 2025',
      'about.description': 'Our advanced machine learning system can identify over 500+ languages, including rare and low-resource languages that are often missed by traditional language detection tools.',
      'about.features': 'Key Features',
      'about.feature1': 'Support for 500+ languages including rare dialects',
      'about.feature2': 'Multiple AI model providers for best accuracy',
      'about.feature3': 'Real-time language detection with confidence scores',
      'about.feature4': 'Specialized in low-resource language identification',

      // Status
      'status.loading': 'Detecting language...',
      'status.ready': 'Ready to detect language',
      'status.error': 'Error occurred during detection',
      'status.success': 'Language detected successfully',

      // Errors
      'error.noProvider': 'No provider selected. Please select a model provider in settings.',
      'error.noText': 'Please enter some text to analyze.',
      'error.serverError': 'Unable to connect to the server. Please check if the backend is running.',
      'error.classificationFailed': 'Language detection failed. Please try again.',

      // BWKI Banner
      'banner.title': 'BWKI2025 Submission',
      'banner.description': 'This project is for the BWKI2025 submission. As this is not intended as a final product, but more like a demo for the competition, it is not to be expected to be available all the time (The deployed version is very cheap / free).',
      'banner.note_label': 'Note',
      'banner.note': 'If a request is taking longer, don\'t worry! Due to budget constraints, the server handling your request was most likely sent to shutdown and now has to cold start again - Give it some time',

      // Footer
      'footer.cooperation': 'In cooperation with'
    },
    de: {
      // Header
      'app.title': 'Sprachidentifikation seltener Sprachen',
      'app.subtitle': 'KI-gestützte Sprachidentifikation für seltene und ressourcenarme Sprachen',
      'header.language': 'Sprache',

      // Main interface
      'input.placeholder': 'Geben Sie hier Text ein, um die Sprache zu identifizieren...',
      'input.examples': 'Beispiele ausprobieren',
      'button.classify': 'Sprache erkennen',
      'button.clear': 'Löschen',
      'button.copy': 'Ergebnis kopieren',

      // Results
      'results.title': 'Erkennungsergebnisse',
      'results.confidence': 'Vertrauen',
      'results.language': 'Sprache',
      'results.probability': 'Wahrscheinlichkeit',
      'results.noResults': 'Keine Ergebnisse anzuzeigen',
      'results.topResult': 'Wahrscheinlichste Sprache',

      // Settings
      'settings.title': 'Einstellungen',
      'settings.backend_url': 'Backend-URL',
      'settings.backend_url.placeholder': 'Backend-URL eingeben',
      'settings.provider': 'KI-Modell-Anbieter',
      'settings.provider.placeholder': 'Anbieter auswählen',
      'settings.languages': 'unterstützte Sprachen',
      'settings.version': 'Version',

      // Examples
      'examples.title': 'Probieren Sie diese Beispiele',
      'examples.english': 'Hello, how are you today?',
      'examples.german': 'Hallo, wie geht es dir heute?',
      'examples.spanish': 'Hola, ¿cómo estás hoy?',
      'examples.french': 'Bonjour, comment allez-vous aujourd\'hui?',
      'examples.italian': 'Ciao, come stai oggi?',

      // About
      'about.title': 'Über BwKi 2025',
      'about.description': 'Unser fortschrittliches maschinelles Lernsystem kann über 500+ Sprachen identifizieren, einschließlich seltener und ressourcenarmer Sprachen, die von herkömmlichen Spracherkennungstools oft übersehen werden.',
      'about.features': 'Hauptmerkmale',
      'about.feature1': 'Unterstützung für 500+ Sprachen einschließlich seltener Dialekte',
      'about.feature2': 'Mehrere KI-Modell-Anbieter für beste Genauigkeit',
      'about.feature3': 'Echtzeit-Spracherkennung mit Vertrauenswerten',
      'about.feature4': 'Spezialisiert auf ressourcenarme Sprachidentifikation',

      // Status
      'status.loading': 'Sprache wird erkannt...',
      'status.ready': 'Bereit zur Spracherkennung',
      'status.error': 'Fehler bei der Erkennung aufgetreten',
      'status.success': 'Sprache erfolgreich erkannt',

      // Errors
      'error.noProvider': 'Kein Anbieter ausgewählt. Bitte wählen Sie einen Modellanbieter in den Einstellungen.',
      'error.noText': 'Bitte geben Sie Text zur Analyse ein.',
      'error.serverError': 'Verbindung zum Server nicht möglich. Bitte prüfen Sie, ob das Backend läuft.',
      'error.classificationFailed': 'Spracherkennung fehlgeschlagen. Bitte versuchen Sie es erneut.',

      // BWKI Banner
      'banner.title': 'BWKI2025 Einreichung',
      'banner.description': 'Dieses Projekt ist für die BWKI2025 Einreichung. Da es nicht als Endprodukt, sondern als Demo für den Wettbewerb gedacht ist, ist nicht zu erwarten, dass es immer verfügbar ist (Die bereitgestellte Version ist sehr günstig / kostenlos).',
      'banner.note_label': 'Hinweis',
      'banner.note': 'Falls eine Anfrage länger dauert, keine Sorge! Aufgrund von Budgetbeschränkungen wurde der Server, der Ihre Anfrage bearbeitet, wahrscheinlich heruntergefahren und muss jetzt kalt starten - Geben Sie ihm etwas Zeit',

      // Footer
      'footer.cooperation': 'In Zusammenarbeit mit'
    }
  };

  getCurrentLanguage(): string {
    return this.currentLang.value;
  }

  setLanguage(lang: string): void {
    if (this.translations[lang]) {
      this.currentLang.next(lang);
      localStorage.setItem('bwki-language', lang);
    }
  }

  getTranslation(key: string, lang?: string): string {
    const language = lang || this.currentLang.value;
    return this.translations[language]?.[key] || key;
  }

  getAvailableLanguages(): Array<{code: string, name: string, flag: string}> {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
    ];
  }

  loadSavedLanguage(): void {
    const saved = localStorage.getItem('bwki-language');
    if (saved && this.translations[saved]) {
      this.currentLang.next(saved);
    }
  }
}
