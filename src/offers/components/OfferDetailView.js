import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "../../appStore";
import PageTemplate from "../../pages/reusable/PageTemplate";
import ProductsList from "../../products/ProductsList";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";

function OfferDetailView(props) {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [offerData, setOfferData] = useState({})
  const productData = useAppStore((state) => state.rows);
  useEffect(() => {
    getProductsForSaleTag();
    getOfferById()
  }, []);

  const getOfferById = async () => {
    const document = doc(db, 'Offers', id)
    const data = await getDoc(document)
    setOfferData(data.data())
  }
  console.log(offerData)
  const getProductsForSaleTag = async () => {
    setRows(productData.filter((prod) => prod.saleTag == id));
  };

  return (
    <PageTemplate title="Offer Details" subTitle={Object.keys(offerData).length ? `- ${offerData.title} | ${offerData.startDate} | ${offerData.endDate} | Discount - ${offerData.discountPercent}` : ''}>
      {rows.length ? (
        <ProductsList rows={rows} isDetailView={true} />
      ) : (
        "No Products Added to this offer"
      )}
    </PageTemplate>
  );
}

export default OfferDetailView;
