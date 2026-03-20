"use client";

import { FormEvent, useEffect, useState } from "react";
import { LeadStatus } from "@/types/lead";

const statuses: LeadStatus[] = ["New", "Engaged", "Proposal Sent", "Closed-Won", "Closed-Lost"];

interface LeadFormProps {
  title: string;
  submitLabel: string;
  onSubmitLead: (payload: { name: string; email: string; status: LeadStatus }) => Promise<void>;
  isSubmitting: boolean;
  onClose?: () => void;
  initialValues?: {
    name: string;
    email: string;
    status: LeadStatus;
  };
}

export default function LeadForm({
  title,
  submitLabel,
  onSubmitLead,
  isSubmitting,
  onClose,
  initialValues,
}: LeadFormProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [status, setStatus] = useState<LeadStatus>(initialValues?.status || "New");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialValues?.name || "");
    setEmail(initialValues?.email || "");
    setStatus(initialValues?.status || "New");
    setError(null);
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Name and email are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);

    try {
      await onSubmitLead({ name: trimmedName, email: trimmedEmail, status });

      if (!initialValues) {
        setName("");
        setEmail("");
        setStatus("New");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save lead.");
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md px-2 text-xl font-semibold leading-none text-slate-600 hover:bg-slate-100"
          >
            ×
          </button>
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-500"
            placeholder="Jane Doe"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-500"
            placeholder="jane@company.com"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-500"
            disabled={isSubmitting}
          >
            {statuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
