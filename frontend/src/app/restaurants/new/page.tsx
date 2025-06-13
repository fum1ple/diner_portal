import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dynamic from 'next/dynamic';
import Breadcrumb from "@/components/ui/navigation/Breadcrumb";

const AddRestaurantForm = dynamic(() => import("@/components/AddRestaurantForm"), {
  loading: () => <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>,
  ssr: false
});

export default async function RestaurantNewPage() {
  await getServerSession(authOptions);
  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { label: '店舗一覧', href: '/restaurants' },
                { label: '新規登録' },
              ]}
            />
          </div>
          <AddRestaurantForm />
        </div>
      </div>
    </div>
  );
}