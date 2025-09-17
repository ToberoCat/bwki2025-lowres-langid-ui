import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ClassificationResult } from '../services/language-classification.service';

@Component({
  selector: 'app-classification-results',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    BadgeModule,
    ProgressBarModule,
    TranslatePipe
  ],
  templateUrl: './classification-results.component.html',
  styleUrl: './classification-results.component.scss'
})
export class ClassificationResultsComponent {
  @Input() results: ClassificationResult[] = [];
  @Input() writingSystem: string = '';
  @Input() chartData: any = {};
  @Input() chartOptions: any = {};

  get topResult(): ClassificationResult | null {
    return this.results.length > 0 ? this.results[0] : null;
  }

  get otherResults(): ClassificationResult[] {
    return this.results.slice(1, 6);
  }

  get showChart(): boolean {
    return this.results.length > 1;
  }
}