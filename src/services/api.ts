import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production (same domain)
  : 'http://localhost:4200';

export interface UsageStats {
  endpoint: string;
  total_requests: number;
  avg_response_time: number;
  avg_text_length: number;
  successful_requests: number;
  failed_requests: number;
  date: string;
  avg_original_score?: number;
  avg_improved_score?: number;
  avg_score_improvement?: number;
  prompts_improved?: number;
}

export interface MetricsResponse {
  period_days: number;
  stats: UsageStats[];
}

export interface DetailedMetrics {
  total_requests: number;
  score_requests: number;
  improve_requests: number;
  avg_improvement: number;
  max_improvement: number;
  successful_improvements: number;
  total_improvements: number;
  avg_response_time: number;
  successful_requests: number;
  failed_requests: number;
}

export interface DetailedMetricsResponse {
  period_days: number;
  metrics: DetailedMetrics;
}

export interface PromptRecord {
  id: number;
  original_prompt: string;
  improved_prompt: string;
  original_score: number;
  improved_score: number;
  score_improvement: number;
  request_timestamp: string;
}

export interface HighQualityPromptsResponse {
  prompts: PromptRecord[];
  search_term: string;
  min_score: number;
}

export interface DashboardDataResponse {
  usage_stats: MetricsResponse;
  detailed_metrics: DetailedMetricsResponse;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getDashboardData(days: number = 30): Promise<DashboardDataResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }


  async checkServerHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking server health:', error);
      throw error;
    }
  }

  async searchHighQualityPrompts(searchTerm: string = ''): Promise<HighQualityPromptsResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/high-quality-prompts?search=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching high-quality prompts:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();