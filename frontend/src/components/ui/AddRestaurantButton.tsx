// 店舗追加ボタンコンポーネント
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AddRestaurantButton = () => (
  <Button asChild className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-teal-600 hover:to-emerald-600 transition-colors">
    <Link href="/restaurants/new" prefetch={false} aria-label="店舗を追加">
      <PlusCircle className="w-5 h-5" />
      <span>店舗を追加</span>
    </Link>
  </Button>
);

export default AddRestaurantButton;
