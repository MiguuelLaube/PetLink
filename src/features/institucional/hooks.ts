import { useQuery } from '@tanstack/react-query';
import { getNews, listContent } from '@/services/content';

export const usePartners = () => useQuery({ queryKey: ['public', 'partners'], queryFn: () => listContent('partners'), staleTime: 10 * 60_000 });
export const useNews = () => useQuery({ queryKey: ['public', 'news'], queryFn: () => listContent('news'), staleTime: 10 * 60_000 });
export const useStories = () => useQuery({ queryKey: ['public', 'stories'], queryFn: () => listContent('stories'), staleTime: 10 * 60_000 });
export const useNewsItem = (id?: string) => useQuery({ queryKey: ['public', 'news', id], queryFn: () => getNews(id!), enabled: !!id });
