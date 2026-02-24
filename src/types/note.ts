export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}
