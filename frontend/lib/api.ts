import { Lead, LeadStatus } from "@/types/lead";
import axios, { isAxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface ValidationErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: unknown): never => {
  if (isAxiosError<ValidationErrorResponse>(error)) {
    const errorData = error.response?.data;
    const message = errorData?.message || error.message || "Request failed";
    const detailedErrors = errorData?.errors
      ? Object.values(errorData.errors)
          .flat()
          .join(", ")
      : "";

    throw new Error(detailedErrors ? `${message}: ${detailedErrors}` : message);
  }

  throw new Error("Unexpected error occurred while making request.");
};

export const getLeads = async (): Promise<Lead[]> => {
  try {
    const response = await apiClient.get<Lead[]>("/leads", {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createLead = async (payload: {
  name: string;
  email: string;
}): Promise<Lead> => {
  try {
    const response = await apiClient.post<Lead>("/leads", payload);

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateLeadStatus = async (
  leadId: string,
  status: LeadStatus
): Promise<Lead> => {
  try {
    const response = await apiClient.patch<Lead>(`/leads/${leadId}/status`, { status });

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateLead = async (
  leadId: string,
  payload: { name: string; email: string; status: LeadStatus }
): Promise<Lead> => {
  try {
    const response = await apiClient.patch<Lead>(`/leads/${leadId}`, payload);

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteLead = async (leadId: string): Promise<void> => {
  try {
    await apiClient.delete<{ message: string }>(`/leads/${leadId}`);
  } catch (error) {
    return handleApiError(error);
  }
};
