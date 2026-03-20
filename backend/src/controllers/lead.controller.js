import mongoose from "mongoose";
import { Lead } from "../models/lead.model.js";

// Controller functions for lead management
const createLead = async (req, res, next) => {
  try {
    const { name, email } = req.validatedBody;

    const lead = await Lead.create({ name, email });

    return res.status(201).json(lead);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return next(error);
  }
};

// Get all leads, sorted by creation date (newest first)
const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.status(200).json(leads);
  } catch (error) {
    return next(error);
  }
};

// Update only the status of a lead
const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.validatedBody;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json(updatedLead);
  } catch (error) {
    return next(error);
  }
};

// Update lead details (name, email, and status)
const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, status } = req.validatedBody;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { name, email, status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json(updatedLead);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    return next(error);
  }
};
// Delete a lead by ID
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export {
  createLead,
  getLeads,
  updateLeadStatus,
  updateLead,
  deleteLead,
};
