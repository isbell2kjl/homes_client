export interface PendingResponse {
    hasPendingRequests: boolean;
    requests?: Request[]; // Optional array of requests
  }

  export interface UserResponse {
    hasUserRequests: boolean;
    requests?: Request[]; // Optional array of requests
  }