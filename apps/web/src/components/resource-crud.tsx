"use client";

import { useMemo, useState } from "react";
import { DEMO_GYM_ID } from "@gymflow/lib";
import { Button, Card, Input } from "@gymflow/ui";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "textarea";

type FieldConfig = {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
};

type ColumnConfig<T> = {
  label: string;
  render: (item: T) => React.ReactNode;
  searchable?: boolean;
};

export function ResourceCrud<T extends { id: string }>({
  resource,
  title,
  description,
  initialItems,
  emptyState,
  fields,
  columns,
  initialForm,
}: {
  resource:
    | "members"
    | "plans"
    | "payments"
    | "attendance"
    | "trainers"
    | "workouts"
    | "diet-plans";
  title: string;
  description: string;
  initialItems: T[];
  emptyState: string;
  fields: FieldConfig[];
  columns: ColumnConfig<T>[];
  initialForm: Record<string, string | boolean>;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [form, setForm] =
    useState<Record<string, string | boolean>>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState(description);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      return columns.some((col) => {
        if (!col.searchable) return false;
        const value = col.render(item);
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [items, searchQuery, columns]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const isEditing = Boolean(editingId);
    const url = isEditing
      ? `/api/${resource}/${editingId}`
      : `/api/${resource}`;
    const method = isEditing ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-gym-id": DEMO_GYM_ID,
      },
      body: JSON.stringify(form),
    });

    const result = (await response.json()) as {
      success?: boolean;
      record?: T;
      error?: string;
    };
    if (!result.success || !result.record) {
      setStatus(result.error ?? "Request failed.");
      setLoading(false);
      return;
    }

    setItems((current) =>
      isEditing
        ? current.map((item) =>
            item.id === result.record!.id ? result.record! : item,
          )
        : [result.record!, ...current],
    );
    setForm(initialForm);
    setEditingId(null);
    setStatus(isEditing ? "Record updated." : "Record created.");
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const response = await fetch(`/api/${resource}/${id}`, {
      method: "DELETE",
      headers: {
        "x-gym-id": DEMO_GYM_ID,
      },
    });
    const result = (await response.json()) as {
      success?: boolean;
      error?: string;
    };
    if (!result.success) {
      setStatus(result.error ?? "Delete failed.");
      setLoading(false);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(initialForm);
    }
    setStatus("Record deleted.");
    setLoading(false);
  }

  function handleEdit(item: T) {
    const nextForm: Record<string, string | boolean> = { ...initialForm };
    for (const field of fields) {
      const value = (item as Record<string, unknown>)[field.key];
      nextForm[field.key] =
        typeof value === "boolean" ? value : value ? String(value) : "";
    }
    setForm(nextForm);
    setEditingId(item.id);
    setStatus(`Editing ${title.toLowerCase()} entry.`);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-950">
            {editingId ? `Edit ${title}` : `Create ${title}`}
          </h3>
          <p className="text-sm text-slate-500">{status}</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label
              key={field.key}
              className="grid gap-2 text-sm font-medium text-slate-700"
            >
              {field.label}
              {field.type === "textarea" ? (
                <textarea
                  className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200"
                  value={String(form[field.key] ?? "")}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                />
              ) : field.type === "select" ? (
                <select
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  value={String(form[field.key] ?? "")}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                >
                  <option value="">Select</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.key])}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 rounded border-slate-300"
                />
              ) : (
                <Input
                  type={field.type ?? "text"}
                  value={String(form[field.key] ?? "")}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                />
              )}
            </label>
          ))}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                  setStatus(description);
                }}
              >
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-950">
              {title} records
            </h3>
            <p className="text-sm text-slate-500">
              {filteredItems.length} of {items.length} records
            </p>
          </div>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th key={column.label} className="px-4 py-3 font-medium">
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {searchQuery ? "No matching records found." : emptyState}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    {columns.map((column) => (
                      <td
                        key={column.label}
                        className="px-4 py-3 text-slate-700"
                      >
                        {column.render(item)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
