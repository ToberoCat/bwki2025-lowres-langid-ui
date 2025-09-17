import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  constructor(private http: HttpClient) {}

  checkHealth(baseUrl: string): Observable<any> {
    return this.http.get(`${baseUrl}/health`);
  }

  classifyText(text: string, baseUrl: string, locale: string = 'en'): Observable<ClassificationResponse> {
    const request: ClassifyRequest = {
      text,
      locale
    };

    return this.http.post<ServerResponse>(`${baseUrl}/api/v1/classify`, request)
      .pipe(
        map(serverResponse => this.transformServerResponse(serverResponse))
      );
  }

  private transformServerResponse(serverResponse: ServerResponse): ClassificationResponse {
    const classifications: ClassificationResult[] = serverResponse.predictions.map(prediction => ({
      language: prediction.language_name || prediction.language_id,
      probability: prediction.probability
    }));

    return {
      classifications,
      writing_system: serverResponse.writing_system
    };
  }
}