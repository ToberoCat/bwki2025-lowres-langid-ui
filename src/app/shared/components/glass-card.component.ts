import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glass-card.component.html',
  styleUrl: './glass-card.component.scss'
})
export class GlassCardComponent {
  @Input() padding: 'small' | 'medium' | 'large' = 'medium';
  @Input() animated: boolean = true;
}