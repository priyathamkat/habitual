export type EntryRead = {
  id: string;
  timestamp: string; // ISO datetime string
  content: string;
};

export type EntryListResponse = {
  items: EntryRead[];
  total: number;
  limit: number;
  offset: number;
};

export type EntryCreate = {
  content: string;
};

export type EntryUpdate = {
  content?: string;
};

