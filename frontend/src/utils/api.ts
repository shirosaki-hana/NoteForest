// API 기본 설정 및 유틸리티 함수
const API_BASE_URL = 'http://localhost:3001';

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// HTTP 메서드 타입
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 기본 API 호출 함수
export async function apiCall<T = any>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
    };
  }
}

// 편의 함수들
export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiCall<T>(endpoint, 'GET', undefined, headers),
  
  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiCall<T>(endpoint, 'POST', body, headers),
  
  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiCall<T>(endpoint, 'PUT', body, headers),
  
  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiCall<T>(endpoint, 'DELETE', undefined, headers),
};
