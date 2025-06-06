"use client";

import React from "react";
import ProtectedPage from "@/components/ProtectedPage";
import AddRestaurantForm from "@/components/AddRestaurantForm";

const RestaurantNewPage = () => (
    <ProtectedPage>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <AddRestaurantForm />
          </div>
        </div>
      </div>
    </ProtectedPage>
  );

export default RestaurantNewPage;