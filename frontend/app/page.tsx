"use client";

import { useEffect, useMemo, useState } from "react";
import LeadForm from "@/components/LeadForm";
import LeadsTable from "@/components/LeadsTable";
import { createLead, deleteLead, getLeads, updateLead } from "@/lib/api";
import { Lead, LeadStatus } from "@/types/lead";

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getLeads();
      setLeads(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to fetch leads.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const handleCreateLead = async (payload: {
    name: string;
    email: string;
    status: LeadStatus;
  }) => {
    setIsSubmitting(true);

    try {
      await createLead(payload);
      await loadLeads();
      setToastMessage("Lead created successfully.");
      setIsModalOpen(false);
      setEditingLead(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLead = async (payload: {
    name: string;
    email: string;
    status: LeadStatus;
  }) => {
    if (!editingLead) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updated = await updateLead(editingLead._id, payload);

      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead._id === editingLead._id ? updated : lead))
      );
      setToastMessage("Lead updated successfully.");
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = (leadId: string) => {
    const lead = leads.find((item) => item._id === leadId) || null;
    setLeadToDelete(lead);
  };

  const handleConfirmDeleteLead = async () => {
    if (!leadToDelete) {
      return;
    }

    const leadId = leadToDelete._id;
    setDeletingLeadId(leadId);

    try {
      await deleteLead(leadId);
      setLeads((currentLeads) => currentLeads.filter((lead) => lead._id !== leadId));
      setToastMessage("Lead deleted successfully.");
      setLeadToDelete(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete lead.");
    } finally {
      setDeletingLeadId(null);
    }
  };

  const handleOpenCreate = () => {
    setError(null);
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setError(null);
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingLead(null);
  };

  const leadCountLabel = useMemo(() => {
    return `${leads.length} lead${leads.length === 1 ? "" : "s"}`;
  }, [leads]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-sm text-slate-600">Track and manage your sales leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
            {leadCountLabel}
          </span>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create
          </button>
        </div>
      </header>

      {toastMessage ? (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {toastMessage}
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">All Leads</h2>
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          error={error}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteLead}
          deletingLeadId={deletingLeadId}
        />
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md">
            <LeadForm
              title={editingLead ? "Edit Lead" : "Create New Lead"}
              submitLabel={editingLead ? "Update Lead" : "Create Lead"}
              onSubmitLead={editingLead ? handleUpdateLead : handleCreateLead}
              isSubmitting={isSubmitting}
              onClose={handleCloseModal}
              initialValues={
                editingLead
                  ? {
                      name: editingLead.name,
                      email: editingLead.email,
                      status: editingLead.status,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      ) : null}

      {leadToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Delete Lead</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <span className="font-medium text-slate-900">{leadToDelete.name}</span>?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                disabled={deletingLeadId === leadToDelete._id}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteLead}
                disabled={deletingLeadId === leadToDelete._id}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingLeadId === leadToDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
