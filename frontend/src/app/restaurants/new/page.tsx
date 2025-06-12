import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AddRestaurantForm from "@/components/AddRestaurantForm";
import Breadcrumb from "@/components/Breadcrumb";

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