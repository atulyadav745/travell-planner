import { Trip } from './base';

export interface ShareTokenResponse {
  token: string;
}

export interface ShareTokenVerifyResponse {
  trip: Trip;
}