import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private config = {
    production: environment.production,
    backendUrl: environment.backendUrl,
    apiVersion: environment.apiVersion
  };

  get backendUrl(): string {
    return this.config.backendUrl;
  }

  get apiVersion(): string {
    return this.config.apiVersion;
  }

  get production(): boolean {
    return this.config.production;
  }

  get apiBaseUrl(): string {
    return `${this.backendUrl}/api/${this.apiVersion}`;
  }

  setBackendUrl(url: string): void {
    this.config.backendUrl = url;
  }
}
