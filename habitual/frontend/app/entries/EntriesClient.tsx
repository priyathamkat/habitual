"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  Select,
  Tooltip,
  rem,
} from "@mantine/core";
import { createEntry, deleteEntry, listEntries, updateEntry } from "../lib/api";
import type { EntryRead } from "../types/entries";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const PAGE_SIZE = 10;

export default function EntriesClient() {
  const [items, setItems] = useState<EntryRead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<EntryRead | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<EntryRead | null>(null);

  const [timeFilter, setTimeFilter] = useState<string | null>("all");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listEntries({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, order: "desc" });
      setItems(res.items);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setContent("");
    setAddOpen(true);
  }

  function openEdit(entry: EntryRead) {
    setEditing(entry);
    setContent(entry.content);
    setEditOpen(true);
  }

  async function onSubmitAdd() {
    setSubmitting(true);
    try {
      await createEntry({ content });
      setAddOpen(false);
      // Reset to first page to see the latest if descending
      setPage(1);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create entry");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmitEdit() {
    if (!editing) return;
    setSubmitting(true);
    try {
      await updateEntry(editing.id, { content });
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update entry");
    } finally {
      setSubmitting(false);
    }
  }

  function askDelete(entry: EntryRead) {
    setToDelete(entry);
    setConfirmOpen(true);
  }

  async function onConfirmDelete() {
    if (!toDelete) return;
    try {
      await deleteEntry(toDelete.id);
      const newTotal = total - 1;
      const maxPage = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
      if (page > maxPage) setPage(maxPage);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete entry");
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  }

  function onKeyDownModal(e: React.KeyboardEvent<HTMLDivElement>, save: () => void, cancel: () => void) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  }

  const filteredItems = useMemo(() => {
    let list = items;
    if (timeFilter === "month") {
      const start = dayjs().startOf("month");
      list = list.filter((i) => dayjs(i.timestamp).isAfter(start));
    }
    return list;
  }, [items, timeFilter]);

  return (
    <Stack p="lg" gap="md">
      <Group justify="space-between" align="center">
        <Title order={2} style={{ color: "#EAEAEA" }}>
          Entries
        </Title>
        <Button color="blue" onClick={openAdd} leftSection={<Plus size={16} />}>
          Add Entry
        </Button>
      </Group>

      <Group gap="sm" wrap="wrap">
        <Select
          data={[
            { value: "all", label: "All time" },
            { value: "month", label: "This month" },
          ]}
          value={timeFilter}
          onChange={setTimeFilter}
          style={{ width: rem(160) }}
        />
      </Group>

      {error && (
        <Paper p="sm" bg="red.1" radius="md" withBorder>
          <Text c="red.9">{error}</Text>
        </Paper>
      )}

      {loading ? (
        <Group justify="center" p="lg">
          <Loader />
        </Group>
      ) : filteredItems.length === 0 ? (
        <Paper p="lg" radius="md" withBorder style={{ background: "var(--surface)", borderColor: "#2a2a2a" }}>
          <Text c="dimmed">No entries</Text>
        </Paper>
      ) : (
        <Stack>
          {filteredItems.map((it) => (
            <Paper
              key={it.id}
              p="md"
              radius="md"
              withBorder
              style={{
                position: "relative",
                background: "var(--surface)",
                borderColor: "#2a2a2a",
                transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 18px rgba(0,0,0,0.3)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#3B82F6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a";
              }}
            >
              <Group justify="space-between" align="start">
                <div>
                  <Text size="xs" c="#A0A0A0">
                    {dayjs.utc(it.timestamp).local().format("MMM D, YYYY h:mm A")} • {dayjs.utc(it.timestamp).local().fromNow()}
                  </Text>
                </div>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon variant="subtle" onClick={() => openEdit(it)} aria-label="Edit">
                      <Pencil size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon variant="subtle" color="red" onClick={() => askDelete(it)} aria-label="Delete">
                      <Trash2 size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
              <Text mt="xs" fw={600} style={{ color: "#EAEAEA", lineHeight: 1.5, fontSize: rem(16) }}>
                {it.content}
              </Text>
            </Paper>
          ))}
        </Stack>
      )}

      <Group justify="space-between" align="center">
        <Text size="sm" c="#A0A0A0">
          Total: {total}
          {timeFilter === "month" ? ` • This month in view: ${filteredItems.length}` : ""}
        </Text>
        <Pagination value={page} onChange={setPage} total={totalPages} radius="md" />
      </Group>

      {/* Add Modal */}
      <Modal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Entry"
        centered
        radius="md"
        styles={{ content: { background: "#1E1E1E" } }}
      >
        <Stack onKeyDown={(e) => onKeyDownModal(e, onSubmitAdd, () => setAddOpen(false))}>
          <Textarea
            placeholder="Write something... add emojis like 🍎 🛏️ 🎥"
            autosize
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            styles={{ input: { background: "#2C2C2C", color: "#fff", borderColor: "#333" } }}
          />
          <Group justify="end">
            <Button variant="outline" color="gray" onClick={() => setAddOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={onSubmitAdd} loading={submitting} disabled={!content.trim()}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Entry"
        centered
        radius="md"
        styles={{ content: { background: "#1E1E1E" } }}
      >
        <Stack onKeyDown={(e) => onKeyDownModal(e, onSubmitEdit, () => setEditOpen(false))}>
          <Textarea
            autosize
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            styles={{ input: { background: "#2C2C2C", color: "#fff", borderColor: "#333" } }}
          />
          <Group justify="end">
            <Button variant="outline" color="gray" onClick={() => setEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={onSubmitEdit} loading={submitting} disabled={!content.trim()}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete confirmation */}
      <Modal opened={confirmOpen} onClose={() => setConfirmOpen(false)} centered radius="md" title="Confirm delete" styles={{ content: { background: "#1E1E1E" } }}>
        <Stack>
          <Group>
            <AlertTriangle color="#f59e0b" size={18} />
            <Text>Are you sure you want to delete this entry?</Text>
          </Group>
          <Group justify="end">
            <Button variant="subtle" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button color="red" onClick={onConfirmDelete} leftSection={<Trash2 size={16} />}>Delete</Button>
          </Group>
        </Stack>
      </Modal>

    </Stack>
  );
}
