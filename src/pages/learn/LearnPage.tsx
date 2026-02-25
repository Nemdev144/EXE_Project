import { useState, useEffect } from 'react';
import { getLearnModules, getLearnCategories } from '../../services/api';
import { LearnPageContent, type LessonGroup } from '../../components/learn';
import type { LearnModule, LearnCategory } from '../../types';

function slugify(name: string): string {
  return (name ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'all';
}

function mapModuleToLessonGroup(m: LearnModule, categories: LearnCategory[]): LessonGroup {
  const categorySlug =
    categories.find((c) => c.id === m.categoryId)?.slug ?? slugify(m.categoryName ?? '');
  return {
    id: m.id,
    title: m.title,
    slug: m.slug,
    category: m.categoryName ?? '',
    categorySlug,
    thumbnailUrl: m.thumbnailUrl ?? '',
    lessonCount: m.lessonsCount ?? 0,
    totalDuration: m.durationMinutes ?? 0,
  };
}

export default function LearnPage() {
  const [lessonGroups, setLessonGroups] = useState<LessonGroup[]>([]);
  const [categories, setCategories] = useState<LearnCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getLearnCategories(), getLearnModules()])
      .then(([cats, modules]) => {
        if (!cancelled) {
          setCategories(cats ?? []);
          setLessonGroups((modules ?? []).map((m) => mapModuleToLessonGroup(m, cats ?? [])));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[LearnPage] API Error:', err);
          setLessonGroups([]);
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return <LearnPageContent lessonGroups={lessonGroups} categories={categories} loading={loading} />;
}
