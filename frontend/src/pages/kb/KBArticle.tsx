import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Pencil, Trash2, Save, X } from 'lucide-react';
import { getArticle, updateArticle, deleteArticle } from '../../api/kb';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { extractErrorMessage } from '../../api/client';
import { formatDateTime } from '../../lib/utils';
import { articleFormSchema, ArticleFormValues } from '../../lib/validation';

export function KBArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);

  const {
    data: article,
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: ['kb-article', id], queryFn: () => getArticle(id!), enabled: !!id });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({ resolver: zodResolver(articleFormSchema) });

  useEffect(() => {
    if (article) {
      reset({ title: article.title, content: article.content, tags: article.tags });
    }
  }, [article, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: ArticleFormValues) => updateArticle(id!, values),
    onSuccess: () => {
      showToast({ variant: 'success', message: 'Article updated' });
      setEditing(false);
      void queryClient.invalidateQueries({ queryKey: ['kb-article', id] });
      void queryClient.invalidateQueries({ queryKey: ['kb'] });
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteArticle(id!),
    onSuccess: () => {
      showToast({ variant: 'success', message: 'Article deleted' });
      navigate('/kb');
    },
    onError: (err) => showToast({ variant: 'error', message: extractErrorMessage(err) }),
  });

  if (isError) return <ErrorState message="Could not load this article." onRetry={() => refetch()} />;

  if (isPending || !article) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate('/kb')}
        className="flex w-fit items-center gap-1.5 text-sm text-ink-600 hover:text-ink-950 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to knowledge base
      </button>

      <Card>
        <CardHeader>
          <div>
            {editing ? (
              <Input id="title" error={errors.title?.message} {...register('title')} />
            ) : (
              <h1 className="text-lg font-semibold">{article.title}</h1>
            )}
            <p className="mt-1 font-mono text-xs text-ink-400">
              updated {formatDateTime(article.updatedAt)}
              {article.author && ` · by ${article.author.name}`}
            </p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  isLoading={isSubmitting || updateMutation.isPending}
                  onClick={handleSubmit((values) => updateMutation.mutate(values))}
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={deleteMutation.isPending}
                  onClick={() => {
                    if (confirm('Delete this article? This cannot be undone.')) deleteMutation.mutate();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {editing ? (
            <div className="flex flex-col gap-4">
              <Textarea
                id="content"
                label="Content"
                className="min-h-[200px]"
                error={errors.content?.message}
                {...register('content')}
              />
              <Input
                id="tags"
                label="Tags"
                hint="Comma-separated"
                defaultValue={article.tags.join(', ')}
                onChange={(e) =>
                  setValue(
                    'tags',
                    e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    { shouldValidate: true },
                  )
                }
              />
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap text-sm text-ink-800 dark:text-ink-100">{article.content}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-pill bg-ink-100 px-2 py-0.5 text-xs text-ink-600 dark:bg-ink-800 dark:text-ink-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
