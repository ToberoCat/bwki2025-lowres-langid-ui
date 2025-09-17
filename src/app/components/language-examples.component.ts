import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';

interface LanguageExample {
  flag: string;
  text: string;
}

@Component({
  selector: 'app-language-examples',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './language-examples.component.html',
  styleUrl: './language-examples.component.scss'
})
export class LanguageExamplesComponent {
  @Input() examples: LanguageExample[] = [];
  @Input() disabled: boolean = false;
  @Output() exampleSelected = new EventEmitter<string>();

  onExampleClick(text: string): void {
    if (!this.disabled) {
      this.exampleSelected.emit(text);
    }
  }
}