import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "../../appStore";
import PageTemplate from "../../pages/reusable/PageTemplate";
import ProductsList from "../../products/ProductsList";

function OfferDetailView(props) {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const productData = useAppStore((state) => state.rows);

  useEffect(() => {
    getProductsForSaleTag();
  }, []);

  const getProductsForSaleTag = async () => {
    setRows(productData.filter((prod) => prod.saleTag == id));
  };

  return (
    <PageTemplate title="Offer Details">
      <Typography></Typography>
      {rows.length ? (
        <ProductsList rows={rows} isDetailView={true} />
      ) : (
        "No Products Added to this offer"
      )}
    </PageTemplate>
  );
}

export default OfferDetailView;
