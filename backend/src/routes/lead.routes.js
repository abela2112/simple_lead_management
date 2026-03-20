//import necessary modules and controllers
import express from "express";
import {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
  updateLeadStatus,
} from "../controllers/lead.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from "../validators/lead.validator.js";
// Create a router for lead-related routes
const leadRouter = express.Router();

leadRouter.post("/", validate(createLeadSchema), createLead);
leadRouter.get("/", getLeads);
leadRouter.patch("/:id/status", validate(updateLeadStatusSchema), updateLeadStatus);
leadRouter.patch("/:id", validate(updateLeadSchema), updateLead);
leadRouter.delete("/:id", deleteLead);

// Export the router to be used in the main application
export { leadRouter };
