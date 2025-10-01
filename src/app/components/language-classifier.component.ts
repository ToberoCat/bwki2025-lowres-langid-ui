import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { LanguageClassificationService, ClassificationResult } from '../services/language-classification.service';
import { I18nService } from '../services/i18n.service';
import { EnvironmentService } from '../services/environment.service';
import { Textarea } from 'primeng/textarea';
import { TranslatePipe } from '../pipes/translate.pipe';
import { LanguageExamplesComponent } from './language-examples.component';
import { ClassificationResultsComponent } from './classification-results.component';
import { LoadingSpinnerComponent } from '../shared/components';

@Component({
  selector: 'app-language-classifier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MessageModule,
    SelectModule,
    DialogModule,
    ProgressBarModule,
    TooltipModule,
    InputTextModule,
    Textarea,
    TranslatePipe,
    LanguageExamplesComponent,
    ClassificationResultsComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './language-classifier.component.html',
  styleUrl: './language-classifier.component.scss'
})
export class LanguageClassifierComponent implements OnInit {
  inputText: string = '';
  classifications: ClassificationResult[] = [];
  filteredClassifications: ClassificationResult[] = [];
  writingSystem: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showSettings: boolean = false;

  backendUrl: string = '';
  lastResponse: any = null;

  chartData: any = {};
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  examples = [
    { flag: '🇺🇸', text: 'Hello, how are you today?' },
    { flag: '🇩🇪', text: 'Hallo, wie geht es dir heute?' },
    { flag: '🇪🇸', text: 'Hola, ¿cómo estás hoy?' },
    { flag: '🇫🇷', text: 'Bonjour, comment allez-vous aujourd\'hui?' },
    { flag: '🇮🇹', text: 'Ciao, come stai oggi?' },
    { flag: '🇯🇵', text: 'こんにちは、今日はどうですか？' },
    { flag: '🇵🇪', text: 'Ñuqa wasiykita rini, chaypi mikhuyta mikhuni, chaymanta kutiykama hamuni.' },
    { flag: '🇲🇱', text: 'N bɛ taa fɛ ka jɔgɔ kun na, n bɛ se ka bɔ min bɛ taa.' },
    { flag: '📜', text: 'Dat gafregin ih mit firahim firiuuizzo meista, dat ero ni uuas noh ûfhimil, noh paum nihheinîg noh pereg ni uuas.' },
  ];

  constructor(
    private languageService: LanguageClassificationService,
    private i18nService: I18nService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    // Initialize backend URL from environment service
    this.backendUrl = this.environmentService.backendUrl;
  }

  classifyText(): void {
    if (!this.inputText.trim()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.classifications = [];
    this.filteredClassifications = [];
    this.writingSystem = '';

    const currentLanguage = this.i18nService.getCurrentLanguage();

    // Update environment service if custom backend URL is provided
    if (this.backendUrl && this.backendUrl !== this.environmentService.backendUrl) {
      this.environmentService.setBackendUrl(this.backendUrl);
    }

    this.languageService.classifyText(this.inputText, this.backendUrl, currentLanguage)
      .subscribe({
        next: (response) => {
          this.classifications = response.classifications;
          this.filteredClassifications = this.filterSignificantResults(response.classifications);
          this.writingSystem = response.writing_system || '';
          this.lastResponse = response;
          this.updateChart();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Classification error:', error);
          const urlToShow = this.backendUrl || this.environmentService.backendUrl;
          this.errorMessage = `Failed to classify text using the backend at ${urlToShow}. Please check if the backend server is running.`;
          this.isLoading = false;
        }
      });
  }

  private filterSignificantResults(results: ClassificationResult[]): ClassificationResult[] {
    return results.filter(result => result.probability >= 0.0001);
  }

  private updateChart(): void {
    const topResults = this.filteredClassifications.slice(0, 5);

    this.chartData = {
      labels: topResults.map(r => r.language),
      datasets: [{
        data: topResults.map(r => (r.probability * 100).toFixed(1)),
        backgroundColor: [
          '#007bff',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#6c757d'
        ],
        borderWidth: 0
      }]
    };
  }

  useExample(text: string): void {
    this.inputText = text;
  }

  clearText(): void {
    this.inputText = '';
    this.classifications = [];
    this.filteredClassifications = [];
    this.writingSystem = '';
    this.errorMessage = '';
  }
}
