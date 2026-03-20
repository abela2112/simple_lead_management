import { z } from "zod";
import { LEAD_STATUSES } from "../models/lead.model.js";
// Validation schemas for lead-related operations
const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("A valid email is required"),
});
// Schema for updating lead status
const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

const updateLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("A valid email is required"),
  status: z.enum(LEAD_STATUSES),
});

// Export the schemas to be used in routes and controllers
export {
  createLeadSchema,
  updateLeadStatusSchema,
  updateLeadSchema,
};
