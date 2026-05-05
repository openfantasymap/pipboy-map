import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnvService {
  private http = inject(HttpClient);
  private env: Record<string, string> = {};

  async load(): Promise<void> {
    try {
      this.env = await firstValueFrom(
        this.http.get<Record<string, string>>('/assets/env.json')
      );
    } catch {
      this.env = {};
    }
  }

  getEnv(key: string): string | undefined {
    return this.env[key];
  }
}
