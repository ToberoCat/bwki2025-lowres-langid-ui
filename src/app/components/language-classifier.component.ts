import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { LanguageClassificationService, ClassificationResult, ProvidersResponse, ProviderInfo } from '../services/language-classification.service';
import { Textarea } from 'primeng/textarea';
import { delay } from 'rxjs/operators';
import { TranslatePipe } from '../pipes/translate.pipe';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-language-classifier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ChartModule,
    MessageModule,
    SelectModule,
    DialogModule,
    CardModule,
    BadgeModule,
    ProgressBarModule,
    TooltipModule,
    Textarea,
    TranslatePipe
  ],
  template: `
    <div class="language-classifier-container">
      <div class="classifier-card">
        <!-- Header -->
        <div class="card-header">
          <div class="title-section">
            <h2>{{ 'results.title' | translate }}</h2>
            <p>{{ 'about.description' | translate }}</p>
          </div>
          <p-button
            icon="pi pi-cog"
            [text]="true"
            [rounded]="true"
            class="settings-btn"
            (onClick)="showSettings = true"
            [disabled]="isLoading"
            pTooltip="Settings">
          </p-button>
        </div>

        <!-- Quick Examples -->
        <div class="examples-section">
          <div class="examples-header">
            <span class="examples-title">{{ 'examples.title' | translate }}</span>
          </div>
          <div class="examples-grid">
            <button
              *ngFor="let example of examples"
              class="example-btn"
              (click)="useExample(example.text)"
              [disabled]="isLoading">
              <span class="flag">{{ example.flag }}</span>
              <span class="text">{{ example.text }}</span>
            </button>
          </div>
        </div>

        <!-- Input Section -->
        <div class="input-section">
          <div class="input-wrapper">
            <textarea
              pInputTextarea
              [(ngModel)]="inputText"
              [placeholder]="'input.placeholder' | translate"
              class="text-input"
              [disabled]="isLoading"
              rows="4">
            </textarea>
            <div class="input-actions">
              <p-button
                [label]="'button.clear' | translate"
                [text]="true"
                [size]="'small'"
                (onClick)="clearText()"
                [disabled]="!inputText.trim() || isLoading"
                class="clear-btn">
              </p-button>
              <p-button
                [label]="'button.classify' | translate"
                (onClick)="classifyText()"
                [loading]="isLoading"
                [disabled]="!inputText.trim() || !selectedProvider"
                class="classify-btn"
                icon="pi pi-search">
              </p-button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-section" *ngIf="isLoading">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>{{ 'status.loading' | translate }}</p>
            <p-progressBar mode="indeterminate" styleClass="custom-progress"></p-progressBar>
          </div>
        </div>

        <!-- Results Section -->
        <div class="results-section" *ngIf="filteredClassifications.length > 0 && !isLoading">
          <!-- Top Result Card -->
          <p-card class="top-result-card">
            <div class="top-result">
              <div class="result-header">
                <h3>{{ 'results.topResult' | translate }}</h3>
                <p-badge
                  [value]="(filteredClassifications[0].probability * 100).toFixed(1) + '%'"
                  severity="success"
                  size="large">
                </p-badge>
              </div>
              <div class="language-name">
                {{ filteredClassifications[0].language }}
              </div>
              <div class="writing-system">
                <span class="writing-system-label">Writing System:</span>
                <span class="writing-system-value">{{ filteredClassifications[0].writing_system }}</span>
              </div>
              <div class="confidence-bar">
                <p-progressBar
                  [value]="filteredClassifications[0].probability * 100"
                  [showValue]="false"
                  styleClass="confidence-progress">
                </p-progressBar>
              </div>
            </div>
          </p-card>

          <!-- Other Results -->
          <div class="other-results" *ngIf="filteredClassifications.length > 1">
            <h4>{{ 'Other candidates' }}</h4>
            <div class="results-list">
              <div
                *ngFor="let result of filteredClassifications.slice(1, 6)"
                class="result-item">
                <div class="result-language-info">
                  <span class="result-language">{{ result.language }}</span>
                  <span class="result-writing-system">{{ result.writing_system }}</span>
                </div>
                <div class="result-confidence">
                  <span class="confidence-text">{{ (result.probability * 100).toFixed(1) }}%</span>
                  <p-progressBar
                    [value]="result.probability * 100"
                    [showValue]="false"
                    styleClass="mini-progress">
                  </p-progressBar>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart Section -->
          <div class="chart-section" *ngIf="filteredClassifications.length > 1">
            <p-card>
              <div class="chart-container">
                <p-chart
                  type="doughnut"
                  [data]="chartData"
                  [options]="chartOptions">
                </p-chart>
              </div>
            </p-card>
          </div>
        </div>

        <!-- Error Message -->
        <div class="error-section" *ngIf="errorMessage">
          <p-message
            severity="error"
            [text]="errorMessage"
            class="error-message">
          </p-message>
        </div>
      </div>

      <!-- Settings Dialog -->
      <p-dialog
        [(visible)]="showSettings"
        [header]="'settings.title' | translate"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        styleClass="settings-dialog"
        [style]="{width: '90vw', maxWidth: '500px'}">

        <div class="settings-content">
          <div class="setting-group">
            <label>{{ 'settings.provider' | translate }}</label>
            <p-select
              [options]="providerOptions"
              [(ngModel)]="selectedProvider"
              optionLabel="label"
              optionValue="value"
              [placeholder]="'settings.provider.placeholder' | translate"
              [disabled]="isLoading"
              class="provider-select">
            </p-select>

            <div class="provider-info" *ngIf="selectedProviderInfo">
              <div class="info-item">
                <strong>{{ selectedProviderInfo.name }}</strong>
                <span class="version">{{ 'settings.version' | translate }}: {{ selectedProviderInfo.version }}</span>
              </div>
              <div class="info-item">
                <span class="languages-count">
                  {{ selectedProviderInfo.supported_languages }} {{ 'settings.languages' | translate }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .language-classifier-container {
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
    }

    .classifier-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .title-section h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .title-section p {
      margin: 0;
      color: #666;
      font-size: 1rem;
      line-height: 1.5;
    }

    .settings-btn {
      flex-shrink: 0;
    }

    ::ng-deep .settings-btn {
      width: 48px !important;
      height: 48px !important;
      background: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      backdrop-filter: blur(10px) !important;
    }

    ::ng-deep .settings-btn:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      transform: scale(1.05) !important;
    }

    .examples-section {
      margin-bottom: 2.5rem;
    }

    .examples-header {
      margin-bottom: 1rem;
    }

    .examples-title {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .example-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.8);
      border: 2px solid rgba(0, 0, 0, 0.06);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      text-align: left;
      backdrop-filter: blur(10px);
      min-height: 56px;
    }

    .example-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(102, 126, 234, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    }

    .example-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .example-btn .flag {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .example-btn .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #374151;
    }

    .input-section {
      margin-bottom: 2.5rem;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    ::ng-deep .text-input {
      width: 100% !important;
      min-height: 120px !important;
      font-size: 1rem !important;
      line-height: 1.6 !important;
      font-family: 'Inter', system-ui, sans-serif !important;
      border-radius: 16px !important;
      padding: 1.25rem !important;
      border: 2px solid rgba(0, 0, 0, 0.1) !important;
      background: rgba(255, 255, 255, 0.8) !important;
      backdrop-filter: blur(10px) !important;
      transition: all 0.3s ease !important;
      resize: vertical !important;
    }

    ::ng-deep .text-input:focus {
      border-color: #667eea !important;
      background: rgba(255, 255, 255, 0.95) !important;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
      transform: translateY(-1px) !important;
    }

    .input-actions {
      display: flex;
      gap: 1.25rem;
      justify-content: flex-end;
      align-items: center;
    }

    ::ng-deep .clear-btn {
      color: #666 !important;
      padding: 0 1.25rem !important;
      height: 44px !important;
      border-radius: 10px !important;
      transition: all 0.2s ease !important;
    }

    ::ng-deep .clear-btn:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.05) !important;
      color: #374151 !important;
    }

    ::ng-deep .classify-btn {
      border-radius: 12px !important;
      font-weight: 600 !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      transition: all 0.3s ease !important;
    }

    ::ng-deep .classify-btn:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
    }

    .loading-section {
      text-align: center;
      padding: 3rem 1rem;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(102, 126, 234, 0.1);
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    ::ng-deep .custom-progress .p-progressbar {
      height: 6px !important;
      background: rgba(102, 126, 234, 0.1) !important;
      border-radius: 3px !important;
    }

    ::ng-deep .custom-progress .p-progressbar .p-progressbar-value {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }

    .results-section {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .top-result-card {
      animation: fadeInUp 0.5s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    ::ng-deep .top-result-card .p-card-content {
      padding: 0 !important;
    }

    .top-result {
      text-align: center;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .result-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #374151;
      font-weight: 600;
    }

    .language-name {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .writing-system {
      margin-bottom: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .writing-system-label {
      color: #666;
      font-weight: 500;
    }

    .writing-system-value {
      color: #374151;
      font-weight: 600;
      background: rgba(102, 126, 234, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .confidence-bar {
      margin-top: 1rem;
    }

    ::ng-deep .confidence-progress .p-progressbar {
      height: 8px !important;
      background: rgba(102, 126, 234, 0.1) !important;
      border-radius: 4px !important;
    }

    ::ng-deep .confidence-progress .p-progressbar .p-progressbar-value {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    }

    .other-results {
      animation: fadeInUp 0.6s ease-out;
    }

    .other-results h4 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      color: #374151;
      font-weight: 600;
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .result-language-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .result-language {
      font-weight: 500;
      color: #374151;
    }

    .result-writing-system {
      font-size: 0.8rem;
      color: #666;
      background: rgba(102, 126, 234, 0.08);
      padding: 0.15rem 0.5rem;
      border-radius: 8px;
      border: 1px solid rgba(102, 126, 234, 0.15);
      width: fit-content;
    }

    .result-confidence {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 120px;
      justify-content: flex-end;
    }

    .confidence-text {
      font-size: 0.9rem;
      color: #666;
      min-width: 40px;
      text-align: right;
    }

    ::ng-deep .mini-progress {
      width: 60px !important;
    }

    ::ng-deep .mini-progress .p-progressbar {
      height: 4px !important;
      background: rgba(0, 0, 0, 0.1) !important;
    }

    .chart-section {
      animation: fadeInUp 0.7s ease-out;
    }

    .chart-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 1rem;
    }

    .error-section {
      margin: 1.5rem 0;
      animation: fadeInUp 0.3s ease-out;
    }

    ::ng-deep .error-message {
      border-radius: 16px !important;
      background: rgba(239, 68, 68, 0.05) !important;
      border: 2px solid rgba(239, 68, 68, 0.1) !important;
      backdrop-filter: blur(10px) !important;
    }

    ::ng-deep .error-message .p-message-text {
      font-size: 0.9rem !important;
      color: #dc2626 !important;
      line-height: 1.5 !important;
    }

    ::ng-deep .error-message .p-message-icon {
      color: #dc2626 !important;
    }

    .settings-content {
      padding: 1rem 0;
    }

    .setting-group {
      margin-bottom: 1.5rem;
    }

    .setting-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .provider-select {
      width: 100%;
    }

    .provider-info {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(102, 126, 234, 0.1);
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .version {
      font-size: 0.85rem;
      color: #666;
    }

    .languages-count {
      font-size: 0.9rem;
      color: #667eea;
      font-weight: 500;
    }

    // Responsive design
    @media (max-width: 768px) {
      .classifier-card {
        padding: 1.5rem;
        margin: 1rem;
        border-radius: 20px;
      }

      .card-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .title-section h2 {
        font-size: 1.5rem;
      }

      .examples-grid {
        grid-template-columns: 1fr;
      }

      .input-actions {
        flex-direction: column-reverse;
      }

      ::ng-deep .classify-btn {
        width: 100% !important;
      }

      .result-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .result-confidence {
        width: 100%;
        justify-content: space-between;
      }

      .result-language-info {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class LanguageClassifierComponent implements OnInit {
  inputText: string = '';
  classifications: ClassificationResult[] = [];
  filteredClassifications: ClassificationResult[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showSettings: boolean = false;

  // Provider configuration
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
    private languageService: LanguageClassificationService,
    private i18nService: I18nService
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

        // Set default provider
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

    // Add artificial delay (1-2 seconds)
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
    return results.filter(result => result.probability >= 0.0001); // Filter out results below 0.01%
  }

  private updateChart(): void {
    const topResults = this.filteredClassifications.slice(0, 5); // Show top 5

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
