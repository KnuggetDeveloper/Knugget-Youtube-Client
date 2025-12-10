import {
  CarouselGenerationRequest,
  CarouselGenerationResponse,
  ApiResponse,
  CAROUSEL_ENDPOINTS,
} from "@/types/summary";
import { auth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

/**
 * Get Firebase auth token
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

/**
 * Generate carousel slides from a summary
 */
export async function generateCarousel(
  data: CarouselGenerationRequest
): Promise<CarouselGenerationResponse> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_BASE_URL}${CAROUSEL_ENDPOINTS.GENERATE}`,
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
        `Failed to generate carousel: ${response.statusText}`
    );
  }

  const result: ApiResponse<CarouselGenerationResponse> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to generate carousel");
  }

  return result.data;
}

/**
 * Get existing carousel slides for a summary
 */
export async function getCarouselSlides(
  summaryId: string
): Promise<CarouselGenerationResponse | null> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_BASE_URL}${CAROUSEL_ENDPOINTS.GET_SLIDES(summaryId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to get carousel: ${response.statusText}`
    );
  }

  const result: ApiResponse<CarouselGenerationResponse | null> =
    await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to get carousel");
  }

  return result.data || null;
}

/**
 * Convert relative image URL to full URL
 */
export function getFullImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("/uploads")) {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const baseUrl = apiBaseUrl.replace("/api", "");
    return `${baseUrl}${imageUrl}`;
  }

  return imageUrl;
}

