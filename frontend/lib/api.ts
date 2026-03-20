import { Lead, LeadStatus } from "@/types/lead";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface ValidationErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as ValidationErrorResponse | null;
    const message = errorData?.message || "Request failed";
    const detailedErrors = errorData?.errors
      ? Object.values(errorData.errors)
          .flat()
          .join(", ")
      : "";

    throw new Error(detailedErrors ? `${message}: ${detailedErrors}` : message);
  }

  return response.json() as Promise<T>;
};

export const getLeads = async (): Promise<Lead[]> => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    cache: "no-store",
  });

  return parseResponse<Lead[]>(response);
};

export const createLead = async (payload: {
  name: string;
  email: string;
}): Promise<Lead> => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Lead>(response);
};

export const updateLeadStatus = async (
  leadId: string,
  status: LeadStatus
): Promise<Lead> => {
  const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return parseResponse<Lead>(response);
};

export const updateLead = async (
  leadId: string,
  payload: { name: string; email: string; status: LeadStatus }
): Promise<Lead> => {
  const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Lead>(response);
};

export const deleteLead = async (leadId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
    method: "DELETE",
  });

  await parseResponse<{ message: string }>(response);
};
