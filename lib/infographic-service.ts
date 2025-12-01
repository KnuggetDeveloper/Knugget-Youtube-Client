/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InfographicGenerationRequest,
  InfographicGenerationResponse,
  ImageGenerationStats,
  ApiResponse,
  INFOGRAPHIC_ENDPOINTS,
} from "@/types/summary";
import { auth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

/**
 * Get authentication token from Firebase
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Generate infographic from summary transcript
 */
export async function generateInfographic(
  data: InfographicGenerationRequest
): Promise<InfographicGenerationResponse> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_BASE_URL}${INFOGRAPHIC_ENDPOINTS.GENERATE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        `Failed to generate infographic: ${response.statusText}`
    );
  }

  const result: ApiResponse<InfographicGenerationResponse> =
    await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to generate infographic");
  }

  // Return the data as-is (relative path /uploads/...)
  // URL construction will be handled in the component
  return result.data;
}

/**
 * Get image generation statistics
 */
export async function getImageGenerationStats(): Promise<ImageGenerationStats> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_BASE_URL}${INFOGRAPHIC_ENDPOINTS.STATS}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        `Failed to fetch image generation stats: ${response.statusText}`
    );
  }

  const result: ApiResponse<ImageGenerationStats> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch image generation stats");
  }

  return result.data;
}

/**
 * Get image generation usage history
 */
export async function getImageGenerationUsage(
  page: number = 1,
  limit: number = 20
): Promise<any> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_BASE_URL}${INFOGRAPHIC_ENDPOINTS.USAGE}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        `Failed to fetch image generation usage: ${response.statusText}`
    );
  }

  const result: ApiResponse<any> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch image generation usage");
  }

  return result.data;
}
