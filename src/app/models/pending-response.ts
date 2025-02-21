import { PendingRequestItem } from "./request";

export interface PendingResponse {
    hasPendingRequests: boolean;
    requests?: PendingRequestItem []; // Optional array of requests
  }

  export interface UserResponse {
    hasUserRequests: boolean;
    requests?: PendingRequestItem []; // Optional array of requests
  }