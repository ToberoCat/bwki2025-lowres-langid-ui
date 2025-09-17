import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClassificationResult {
  language: string;
  probability: number;
  writing_system: string;
}

export interface ClassificationResponse {
  classifications: ClassificationResult[];
  provider: string;
  provider_version: string;
}

export interface TextRequest {
  text: string;
  provider?: string;
  top_k?: number;
}

export interface ProviderInfo {
  name: string;
  version: string;
  available: boolean;
  supported_languages: number;
}

export interface ProvidersResponse {
  providers: string[];
  default: string | null;
  details: { [key: string]: ProviderInfo };
}

export interface ApiInfo {
  message: string;
  version: string;
  available_providers: string[];
  default_provider: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageClassificationService {
  private readonly baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getApiInfo(): Observable<ApiInfo> {
    return this.http.get<ApiInfo>(`${this.baseUrl}/`);
  }

  getProviders(): Observable<ProvidersResponse> {
    return this.http.get<ProvidersResponse>(`${this.baseUrl}/providers`);
  }

  getProviderLanguages(provider: string): Observable<{ provider: string; supported_languages: string[] }> {
    return this.http.get<{ provider: string; supported_languages: string[] }>(
      `${this.baseUrl}/providers/${provider}/languages`
    );
  }

  classifyText(text: string, provider?: string, topK: number = 10): Observable<ClassificationResponse> {
    const request: TextRequest = { 
      text, 
      provider, 
      top_k: topK 
    };
    
    let params = new HttpParams();
    if (provider) {
      params = params.set('provider', provider);
    }

    return this.http.post<ClassificationResponse>(`${this.baseUrl}/classify`, request, { params });
  }
}