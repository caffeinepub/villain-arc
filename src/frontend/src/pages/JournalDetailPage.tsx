import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Clock, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Layout } from "../components/Layout";
import { LoadingBar } from "../components/LoadingBar";
import { OutlinedButton } from "../components/OutlinedButton";
import { TagBadge } from "../components/TagBadge";
import { UnderlineInput } from "../components/UnderlineInput";
import {
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useGetJournalEntry,
  useUpdateJournalEntry,
} from "../hooks/useQueries";

// ─── Quill modules config ─────────────────────────────────────────────────────

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "blockquote",
];

// ─── Delete Confirmation ──────────────────────────────────────────────────────

function DeleteConfirm({
  onConfirm,
  onCancel,
  isDeleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <dialog
        open
        className="border border-border bg-card p-8 max-w-sm w-full mx-4 shadow-xl m-0 relative"
        aria-label="Confirm deletion"
      >
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
          Confirm Deletion
        </p>
        <h3 className="font-display italic text-2xl text-foreground mb-2 leading-tight">
          Delete this entry?
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
          This action is permanent and cannot be undone.
        </p>
        <div className="flex gap-3">
          <OutlinedButton
            variant="ghost"
            onClick={onCancel}
            disabled={isDeleting}
            data-ocid="delete-cancel"
          >
            Cancel
          </OutlinedButton>
          <OutlinedButton
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
            data-ocid="delete-confirm"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </OutlinedButton>
        </div>
      </dialog>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function resolveId(pathname: string): string {
  const parts = pathname.split("/");
  const raw = parts[parts.length - 1];
  return raw === "journal" ? "new" : raw;
}

export default function JournalDetailPage() {
  const { location } = useRouterState();
  const id = resolveId(location.pathname);
  const isNew = id === "new";
  const navigate = useNavigate();

  const { data: existing, isLoading } = useGetJournalEntry(
    isNew ? null : BigInt(id),
  );
  const { mutate: create, isPending: creating } = useCreateJournalEntry();
  const { mutate: update, isPending: updating } = useUpdateJournalEntry();
  const { mutate: remove, isPending: deleting } = useDeleteJournalEntry();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing entry
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setBody(existing.body);
      setTags(existing.tags);
    }
  }, [existing]);

  // Auto-save draft every 30s (updates only — no-op for new entries without title)
  const handleAutoSave = useCallback(() => {
    if (isNew || !title.trim() || creating || updating) return;
    const input = {
      title: title.trim(),
      body,
      tags,
      caseRefs: existing?.caseRefs ?? [],
      theoryRefs: existing?.theoryRefs ?? [],
    };
    update(
      { id: BigInt(id), input },
      { onSuccess: () => setLastSaved(new Date()) },
    );
  }, [isNew, title, body, tags, id, existing, creating, updating, update]);

  useEffect(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(handleAutoSave, 30_000);
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, [handleAutoSave]);

  function addTag(raw: string) {
    const trimmed = raw.replace(/^#/, "").trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleSave() {
    const input = {
      title: title.trim(),
      body,
      tags,
      caseRefs: existing?.caseRefs ?? [],
      theoryRefs: existing?.theoryRefs ?? [],
    };

    if (isNew) {
      create(input, {
        onSuccess: (entry) => {
          setLastSaved(new Date());
          navigate({ to: "/journal/$id", params: { id: entry.id.toString() } });
        },
      });
    } else {
      update(
        { id: BigInt(id), input },
        {
          onSuccess: () => {
            setLastSaved(new Date());
            navigate({ to: "/journal" });
          },
        },
      );
    }
  }

  function handleDelete() {
    if (!existing) return;
    remove(existing.id, {
      onSuccess: () => navigate({ to: "/journal" }),
    });
  }

  const isSaving = creating || updating;
  const canSave = title.trim().length > 0 && !isSaving;

  return (
    <Layout>
      <style>{`
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid oklch(var(--border)) !important;
          padding: 8px 0 !important;
          background: transparent !important;
        }
        .ql-toolbar .ql-stroke {
          stroke: oklch(var(--muted-foreground)) !important;
        }
        .ql-toolbar .ql-fill {
          fill: oklch(var(--muted-foreground)) !important;
        }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: oklch(var(--foreground)) !important;
        }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: oklch(var(--foreground)) !important;
        }
        .ql-toolbar .ql-picker-label {
          color: oklch(var(--muted-foreground)) !important;
        }
        .ql-toolbar .ql-picker-label:hover {
          color: oklch(var(--foreground)) !important;
        }
        .ql-toolbar .ql-picker-options {
          background: oklch(var(--card)) !important;
          border: 1px solid oklch(var(--border)) !important;
          color: oklch(var(--foreground)) !important;
        }
        .ql-container {
          border: none !important;
          font-family: inherit !important;
        }
        .ql-editor {
          padding: 20px 0 !important;
          font-size: 0.9375rem !important;
          line-height: 1.75 !important;
          color: oklch(var(--foreground)) !important;
          min-height: 320px !important;
          font-family: var(--font-body) !important;
        }
        .ql-editor.ql-blank::before {
          color: oklch(var(--muted-foreground)) !important;
          font-style: normal !important;
          left: 0 !important;
          font-family: var(--font-body) !important;
        }
        .ql-editor h2 {
          font-family: var(--font-display) !important;
          font-style: italic !important;
          font-size: 1.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ql-editor h3 {
          font-family: var(--font-display) !important;
          font-style: italic !important;
          font-size: 1.125rem !important;
        }
        .ql-editor blockquote {
          border-left: 1px solid oklch(var(--border)) !important;
          padding-left: 1rem !important;
          color: oklch(var(--muted-foreground)) !important;
          font-style: italic !important;
          margin: 0 !important;
        }
        .ql-editor a {
          color: oklch(var(--foreground)) !important;
          text-decoration: underline !important;
        }
      `}</style>

      {showDelete && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isDeleting={deleting}
        />
      )}

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Top action bar */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <OutlinedButton
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/journal" })}
            data-ocid="journal-back"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={11} />
              Archive
            </span>
          </OutlinedButton>

          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Clock size={10} />
                Saved{" "}
                {lastSaved.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {!isNew && (
              <OutlinedButton
                variant="danger"
                size="sm"
                onClick={() => setShowDelete(true)}
                disabled={deleting}
                data-ocid="journal-delete-trigger"
              >
                <span className="flex items-center gap-1.5">
                  <Trash2 size={11} />
                  Delete
                </span>
              </OutlinedButton>
            )}
            <OutlinedButton
              size="sm"
              onClick={handleSave}
              disabled={!canSave}
              data-ocid="journal-save"
            >
              <span className="flex items-center gap-1.5">
                <Save size={11} />
                {isSaving ? "Saving..." : isNew ? "Create Entry" : "Save Entry"}
              </span>
            </OutlinedButton>
          </div>
        </div>

        {isLoading && <LoadingBar className="mb-8" />}

        {/* Editor area */}
        <div className="max-w-3xl mx-auto" data-ocid="journal-editor">
          {/* Section label */}
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-6">
            {isNew ? "New Entry — Research Journal" : "Edit Entry"}
          </p>

          {/* Title */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Entry title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-border font-display italic text-3xl md:text-4xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-200 py-3 leading-tight"
              data-ocid="journal-title"
              aria-label="Entry title"
            />
          </div>

          <div className="h-px bg-border mb-8" />

          {/* Rich text body */}
          <div data-ocid="journal-body">
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3">
              Body
            </p>
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              modules={QUILL_MODULES}
              formats={QUILL_FORMATS}
              placeholder="Begin writing your research notes..."
            />
          </div>

          <div className="h-px bg-border my-8" />

          {/* Tags */}
          <div data-ocid="journal-tags">
            <UnderlineInput
              label="Tags"
              placeholder="Add tag and press Enter or comma..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              data-ocid="journal-tag-input"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => removeTag(t)}
                    className="group flex items-center gap-1"
                    title={`Remove #${t}`}
                    aria-label={`Remove tag ${t}`}
                    data-ocid={`tag-remove-${t}`}
                  >
                    <TagBadge
                      label={t}
                      className="group-hover:border-destructive group-hover:text-destructive transition-colors duration-150"
                    />
                    <span className="font-mono text-[9px] text-muted-foreground group-hover:text-destructive transition-colors duration-150">
                      ×
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border my-8" />

          {/* Bottom save */}
          <div className="flex justify-end gap-3">
            <OutlinedButton
              variant="ghost"
              onClick={() => navigate({ to: "/journal" })}
              data-ocid="journal-cancel"
            >
              Cancel
            </OutlinedButton>
            <OutlinedButton
              onClick={handleSave}
              disabled={!canSave}
              data-ocid="journal-save-bottom"
            >
              {isSaving ? "Saving..." : isNew ? "Create Entry" : "Save Entry"}
            </OutlinedButton>
          </div>
        </div>
      </div>
    </Layout>
  );
}
