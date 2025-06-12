import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TopPageClient from './TopPageClient';

export default async function TopPage() {
  await getServerSession(authOptions);
  
  return <TopPageClient />;
}
