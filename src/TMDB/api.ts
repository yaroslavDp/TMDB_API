import { parseOptions } from './utils/parseOptions';

const BASE_URL_V3 = 'https://api.themoviedb.org/3';

export class Api {
  constructor(private accessToken: string) {
    this.accessToken = accessToken;
  }

  async get<T>(path: string, options?: Record<string, any>): Promise<T> {
    const params = parseOptions(options);
    const response = await fetch(`${BASE_URL_V3}${path}?${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    return (await response.json()) as T;
  }
}
