import { api } from './client';
import type { KnowledgeBaseArticle, PagedResult } from '../types';

export async function listArticles(params: { search?: string; tag?: string; page?: number }) {
  const { data } = await api.get<PagedResult<KnowledgeBaseArticle>>('/kb', { params });
  return data;
}

export async function getArticle(id: string) {
  const { data } = await api.get<KnowledgeBaseArticle>(`/kb/${id}`);
  return data;
}

export async function createArticle(input: { title: string; content: string; tags: string[] }) {
  const { data } = await api.post<KnowledgeBaseArticle>('/kb', input);
  return data;
}

export async function updateArticle(
  id: string,
  input: Partial<{ title: string; content: string; tags: string[] }>,
) {
  const { data } = await api.patch<KnowledgeBaseArticle>(`/kb/${id}`, input);
  return data;
}

export async function deleteArticle(id: string) {
  await api.delete(`/kb/${id}`);
}
