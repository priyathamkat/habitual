"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Group, Loader, Modal, Pagination, Paper, Stack, Table, Text, Textarea, Title } from "@mantine/core";
import { createEntry, deleteEntry, listEntries, updateEntry } from "../lib/api";
import type { EntryRead } from "../types/entries";

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

  async function onDelete(entry: EntryRead) {
    // simple confirm; could be replaced with a nicer modal
    const ok = window.confirm("Delete this entry?");
    if (!ok) return;
    try {
      await deleteEntry(entry.id);
      // after deletion, reload current page; adjust page if became empty
      const newTotal = total - 1;
      const maxPage = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
      if (page > maxPage) setPage(maxPage);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete entry");
    }
  }

  return (
    <Stack p="md" gap="md">
      <Group justify="space-between">
        <Title order={2}>Entries</Title>
        <Button onClick={openAdd}>Add Entry</Button>
      </Group>

      {error && (
        <Paper p="sm" bg="red.1" radius="md" withBorder>
          <Text c="red.9">{error}</Text>
        </Paper>
      )}

      <Paper withBorder radius="md" p="0">
        {loading ? (
          <Group justify="center" p="lg">
            <Loader />
          </Group>
        ) : (
          <Table striped highlightOnHover withTableBorder horizontalSpacing="md" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Timestamp</Table.Th>
                <Table.Th>Content</Table.Th>
                <Table.Th style={{ width: 160 }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text c="dimmed">No entries</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                items.map((it) => (
                  <Table.Tr key={it.id}>
                    <Table.Td>{new Date(it.timestamp).toLocaleString()}</Table.Td>
                    <Table.Td>
                      <Text>{it.content}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Button size="xs" variant="light" onClick={() => openEdit(it)}>
                          Edit
                        </Button>
                        <Button size="xs" color="red" variant="light" onClick={() => onDelete(it)}>
                          Delete
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Total: {total}
        </Text>
        <Pagination value={page} onChange={setPage} total={totalPages} radius="md" />
      </Group>

      {/* Add Modal */}
      <Modal opened={addOpen} onClose={() => setAddOpen(false)} title="Add Entry" centered>
        <Stack>
          <Textarea
            placeholder="Write something..."
            autosize
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
          />
          <Group justify="end">
            <Button variant="default" onClick={() => setAddOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={onSubmitAdd} loading={submitting} disabled={!content.trim()}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={editOpen} onClose={() => setEditOpen(false)} title="Edit Entry" centered>
        <Stack>
          <Textarea
            autosize
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
          />
          <Group justify="end">
            <Button variant="default" onClick={() => setEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={onSubmitEdit} loading={submitting} disabled={!content.trim()}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

