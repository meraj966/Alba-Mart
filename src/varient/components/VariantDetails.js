import PageTemplate from "../../pages/reusable/PageTemplate";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Avatar,
} from "@mui/material";

function VariantDetails() {
  const { id } = useParams();

  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchVariantDetails = async () => {
      try {
        const variantRef = collection(db, "Variant");
        const variantQuery = query(variantRef, where("variantName", "==", id));
        const variantSnapshot = await getDocs(variantQuery);
        const variantData = variantSnapshot.docs.map((doc) => doc.data());

        if (variantData.length > 0) {
          setVariant(variantData[0]); // Assuming there's only one variant with the given name
          setLoading(false);

          // Fetch product details for each product ID in the variant's products array
          const productDetailsPromises = variantData[0].products.map(async (productId) => {
            const productRef = collection(db, "Menu");
            const productQuery = query(productRef, where("id", "==", productId));
            const productSnapshot = await getDocs(productQuery);
            const productData = productSnapshot.docs.map((doc) => doc.data());
            return productData[0];
          });

          // Wait for all product details to be fetched
          const products = await Promise.all(productDetailsPromises);
          setProductDetails(products);
        } else {
          setError("Variant not found");
          setLoading(false);
        }
      } catch (error) {
        console.log("Error fetching variant details:", error);
        setError("Error fetching variant details");
        setLoading(false);
      }
    };

    fetchVariantDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!variant) {
    return <p>Variant not found</p>;
  }

  return (
    <PageTemplate>
      <div>
        {/* <h2>{variant.name}'s Variant Details</h2> */}
        <h2 style={{ marginTop: -60 }}>{`${variant.variantName}'s Detail`}</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productDetails.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity} {product.measureUnit}</TableCell>
                  <TableCell>
                    {product.url && product.url.length > 0 && (
                      <Avatar alt={product.name} src={product.url[0]} />
                    )}
                  </TableCell>
                  <TableCell>{product.salePrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </PageTemplate>
  );
}

export default VariantDetails;
