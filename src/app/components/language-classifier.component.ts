import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { LanguageClassificationService, ClassificationResult, ProvidersResponse, ProviderInfo } from '../services/language-classification.service';
import { Textarea } from 'primeng/textarea';
import { delay } from 'rxjs/operators';
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
  isLoading: boolean = false;
  errorMessage: string = '';
  showSettings: boolean = false;

  selectedProvider: string = '';
  providerOptions: Array<{label: string, value: string}> = [];
  providersResponse: ProvidersResponse | null = null;
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
  ];

  constructor(
    private languageService: LanguageClassificationService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  get selectedProviderInfo(): ProviderInfo | null {
    if (!this.providersResponse || !this.selectedProvider) {
      return null;
    }
    return this.providersResponse.details[this.selectedProvider] || null;
  }

  private loadProviders(): void {
    this.languageService.getProviders().subscribe({
      next: (response) => {
        this.providersResponse = response;
        this.providerOptions = response.providers.map(provider => ({
          label: response.details[provider]?.name || provider,
          value: provider
        }));

        if (response.default && response.providers.includes(response.default)) {
          this.selectedProvider = response.default;
        } else if (response.providers.length > 0) {
          this.selectedProvider = response.providers[0];
        }
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.errorMessage = 'Failed to load available providers. Please check if the backend server is running.';
      }
    });
  }

  classifyText(): void {
    if (!this.inputText.trim() || !this.selectedProvider) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.classifications = [];
    this.filteredClassifications = [];

    const artificialDelay = Math.random() * 1000 + 1000;

    this.languageService.classifyText(this.inputText, this.selectedProvider, 10)
      .pipe(delay(artificialDelay))
      .subscribe({
        next: (response) => {
          this.classifications = response.classifications;
          this.filteredClassifications = this.filterSignificantResults(response.classifications);
          this.lastResponse = response;
          this.updateChart();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Classification error:', error);
          this.errorMessage = `Failed to classify text using ${this.selectedProvider} provider. Please check if the backend server is running and the model is available.`;
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
    this.errorMessage = '';
  }
}
