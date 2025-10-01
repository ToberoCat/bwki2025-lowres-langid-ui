import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';

export interface ClassificationResult {
  language: string;
  probability: number;
}

export interface ClassificationResponse {
  classifications: ClassificationResult[];
  writing_system?: string;
}

export interface ClassifyRequest {
  text: string;
  locale?: string;
}

// Server response interfaces
export interface ServerPrediction {
  language_id: string;
  language_name: string;
  probability: number;
}

export interface ServerResponse {
  predictions: ServerPrediction[];
  writing_system: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageClassificationService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  checkHealth(baseUrl?: string): Observable<any> {
    const url = baseUrl || this.environmentService.backendUrl;
    return this.http.get(`${url}/health`);
  }

  classifyText(text: string, baseUrl?: string, locale: string = 'en'): Observable<ClassificationResponse> {
    const request: ClassifyRequest = {
      text,
      locale
    };

    const url = baseUrl || this.environmentService.backendUrl;
    return this.http.post<ServerResponse>(`${url}/api/${this.environmentService.apiVersion}/classify`, request)
      .pipe(
        map(serverResponse => this.transformServerResponse(serverResponse))
      );
  }

  private transformServerResponse(serverResponse: ServerResponse): ClassificationResponse {
    const classifications: ClassificationResult[] = serverResponse.predictions.map(prediction => {
      let languageName = prediction.language_name || prediction.language_id;

      // Replace 'und' (Undetermined) with 'Unknown'
      if (prediction.language_id === 'und' || languageName.toLowerCase() === 'undetermined') {
        languageName = 'Unknown';
      }

      return {
        language: languageName,
        probability: prediction.probability
      };
    });

    return {
      classifications,
      writing_system: serverResponse.writing_system
    };
  }
}