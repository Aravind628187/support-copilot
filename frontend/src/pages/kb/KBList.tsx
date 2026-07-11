import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus, BookOpen } from 'lucide-react';
import { listArticles, createArticle } from '../../api/kb';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  EmptyState,
  ErrorState,
  NoResultsState,
} from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { useToast } from '../../components/ui/Toast';
import { useDebounce } from '../../hooks/useDebounce';
import { extractErrorMessage } from '../../api/client';
import { formatRelative } from '../../lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  articleFormSchema,
  ArticleFormValues,
} from '../../lib/validation';
import { useAuth } from '../../context/AuthContext';

export function KBListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['kb', debouncedSearch],
    queryFn: () =>
      listArticles({
        search: debouncedSearch || undefined,
      }),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      tags: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: ArticleFormValues) =>
      createArticle({
        title: values.title,
        content: values.content,
        tags: values.tags,
      }),

    onSuccess: (article) => {
      showToast({
        variant: 'success',
        message: 'Article created',
      });

      reset();
      setCreateOpen(false);

      void queryClient.invalidateQueries({
        queryKey: ['kb'],
      });

      navigate(`/kb/${article.id}`);
    },

    onError: (err) =>
      showToast({
        variant: 'error',
        message: extractErrorMessage(err),
      }),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Knowledge Base
          </h1>

          <p className="text-sm text-ink-600 dark:text-ink-400">
            The context AI drafts are grounded on — keep it accurate.
          </p>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New article
          </Button>
        )}
      </div>

      <div className="max-w-sm">
        <Input
          id="kb-search"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isError ? (
        <ErrorState
          message="Could not load the knowledge base."
          onRetry={() => refetch()}
        />
      ) : isPending ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-28 w-full rounded-lg"
            />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        debouncedSearch ? (
          <NoResultsState
            onReset={() => setSearch('')}
          />
        ) : (
          <EmptyState
            icon={<BookOpen className="h-6 w-6" />}
            title="No articles yet"
            description="Write your first article so AI drafts have something accurate to ground replies in."
            actionLabel={
              isAdmin
                ? 'Create your first article'
                : undefined
            }
            onAction={
              isAdmin
                ? () => setCreateOpen(true)
                : undefined
            }
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer transition-shadow duration-micro hover:shadow-lg"
              onClick={() =>
                navigate(`/kb/${article.id}`)
              }
            >
              <CardBody className="pt-4">
                <h3 className="mb-1 font-medium">
                  {article.title}
                </h3>

                <p className="mb-2 line-clamp-2 text-sm text-ink-600 dark:text-ink-400">
                  {article.content}
                </p>

                <div className="flex flex-wrap gap-1">
                  {article.tags
                    .slice(0, 3)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-indigo-600 px-2 py-1 text-xs text-white"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <p className="mt-2 font-mono text-[11px] text-ink-400">
                  updated {formatRelative(article.updatedAt)}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {isAdmin && (
        <Modal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          title="New knowledge base article"
        >
          <form
            onSubmit={handleSubmit((v) =>
              createMutation.mutate(v)
            )}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input
              id="title"
              label="Title"
              error={errors.title?.message}
              {...register('title')}
            />

            <Textarea
              id="content"
              label="Content"
              error={errors.content?.message}
              {...register('content')}
            />

            <Input
              id="tags"
              label="Tags"
              hint="Comma-separated"
              onChange={(e) => {
                const tags = e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);

                setValue('tags', tags, {
                  shouldValidate: true,
                });
              }}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setCreateOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                isLoading={
                  isSubmitting ||
                  createMutation.isPending
                }
              >
                Create article
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}