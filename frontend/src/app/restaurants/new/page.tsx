"use client";

import React from "react";
import ProtectedPage from "@/components/ProtectedPage";
import AddRestaurantForm from "@/components/AddRestaurantForm";
import Breadcrumb from "@/components/Breadcrumb";

const RestaurantNewPage = () => (
    <ProtectedPage>
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
    </ProtectedPage>
  );

export default RestaurantNewPage;