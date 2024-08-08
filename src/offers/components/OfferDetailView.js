import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageTemplate from "../../pages/reusable/PageTemplate";
import ProductsList from "../../products/ProductsList";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Stack } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { EDIT_OFFER_DETAILS_URL } from "../../urls";

function OfferDetailView(props) {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [offerData, setOfferData] = useState({});

  const getProducts = async () => {
    const menuData = await getDocs(collection(db, "Menu"));
    const data = menuData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setRows(data.filter((prod) => prod.saleTag == id));
  };

  useEffect(() => {
    getProducts();
    getOfferById();
  }, []);

  const getOfferById = async () => {
    const document = doc(db, "Offers", id);
    const data = await getDoc(document);
    setOfferData(data.data());
  };

  const subTitle = () => (
    <>
      {Object.keys(offerData).length
        ? `- ${offerData?.title} | ${offerData?.startDate} | ${offerData?.endDate} | Discount - ${offerData.discountPercent}`
        : ""}
      <Stack
        direction={"row"}
        sx={{ float: "right" }}
        spacing={2}
        className="my-2 mb-2"
      >
        <Link to={`${EDIT_OFFER_DETAILS_URL}/${id}`} style={{textDecoration: 'none'}}>

        <Button sx={{ marginTop: "5px" }} type="submit" variant="contained">
          <EditIcon sx={{marginRight: '8px', fontSize: '18px'}}/>  Edit Offer
        </Button>
        </Link>
      </Stack>
    </>
  );
  return (
    <PageTemplate title="Offer Details" subTitle={subTitle()}>
      {rows.length ? (
        <ProductsList rows={rows} isDetailView={true} />
        ) : (
        "No Products Added to this offer"
      )}
    </PageTemplate>
  );
}

export default OfferDetailView;
