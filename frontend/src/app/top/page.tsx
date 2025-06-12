import { requireServerAuth } from '@/lib/server-auth';
import TopPageClient from './TopPageClient';

export default async function TopPage() {
  await requireServerAuth();
  
  return <TopPageClient />;
}
