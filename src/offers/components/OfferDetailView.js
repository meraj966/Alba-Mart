import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "../../appStore";
import PageTemplate from "../../pages/reusable/PageTemplate";
import ProductsList from "../../products/ProductsList";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

function OfferDetailView(props) {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [offerData, setOfferData] = useState({});

  const getProducts = async () => {
    const menuData = await getDocs(collection(db, "Menu"))
    const data = menuData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setRows(data.filter((prod) => prod.saleTag == id))
  };

  useEffect(() => {
    getProducts()
    getOfferById();
  }, []);

  const getOfferById = async () => {
    const document = doc(db, "Offers", id);
    const data = await getDoc(document);
    setOfferData(data.data());
  };

  return (
    <PageTemplate
      title="Offer Details"
      subTitle={
        Object.keys(offerData).length
          ? `- ${offerData.title} | ${offerData.startDate} | ${offerData.endDate} | Discount - ${offerData.discountPercent}`
          : ""
      }
    >
      {rows.length ? (
        <ProductsList rows={rows} isDetailView={true} />
      ) : (
        "No Products Added to this offer"
      )}
    </PageTemplate>
  );
}

export default OfferDetailView;
