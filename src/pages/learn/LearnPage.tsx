import { useState, useEffect } from 'react';
import { getLearnModules } from '../../services/api';
import { LearnPageContent, type LessonGroup } from '../../components/learn';
import type { LearnModule, LearnCategory } from '../../types';

function slugify(name: string): string {
  return (name ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'all';
}

function mapModuleToLessonGroup(m: LearnModule): LessonGroup {
  const categorySlug = m.categoryName ? slugify(m.categoryName) : 'all';
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

function extractCategoriesFromModules(modules: LearnModule[]): LearnCategory[] {
  const categoryMap = new Map<number, LearnCategory>();
  
  modules.forEach((m, index) => {
    if (m.categoryId && m.categoryName && !categoryMap.has(m.categoryId)) {
      categoryMap.set(m.categoryId, {
        id: m.categoryId,
        name: m.categoryName,
        slug: slugify(m.categoryName),
        orderIndex: index,
      });
    }
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
}

export default function LearnPage() {
  const [lessonGroups, setLessonGroups] = useState<LessonGroup[]>([]);
  const [modules, setModules] = useState<LearnModule[]>([]);
  const [categories, setCategories] = useState<LearnCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getLearnModules()
      .then((mods) => {
        if (!cancelled) {
          const safeModules = mods ?? [];
          setModules(safeModules);
          const extractedCategories = extractCategoriesFromModules(safeModules);
          setCategories(extractedCategories);
          setLessonGroups(safeModules.map(mapModuleToLessonGroup));
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

  return <LearnPageContent lessonGroups={lessonGroups} categories={categories} modules={modules} loading={loading} />;
}
