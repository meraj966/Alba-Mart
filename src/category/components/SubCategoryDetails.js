import PageTemplate from "../../pages/reusable/PageTemplate";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

function SubCategoryDetails() {
  const { categoryId } = useParams();
  const [subcategoryData, setSubcategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a reference to the specific category document
        const categoryDocRef = doc(db, "CategoryAndSub", categoryId);

        // Get the category document
        const categoryDoc = await getDoc(categoryDocRef);

        if (categoryDoc.exists()) {
          // Access the subCategory map within the category document
          const subCategoryMap = categoryDoc.data().subCategory || {};

          // Extract subcategory data from the map
          const subcategories = Object.keys(subCategoryMap).map((subcategoryName) => {
            const subcategoryData = subCategoryMap[subcategoryName];
            return {
              subcategoryName: subcategoryName,
              imageUrl: subcategoryData.imageUrl,
            };
          });

          setSubcategoryData(subcategories);
          console.error("Error fetching subcategories:");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchData();
  }, [categoryId]);

  return (
    <PageTemplate>
      <TableContainer component={Paper}>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Subcategory Name</strong>
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                <strong>Subcategory Image</strong>
              </TableCell>
              {/* Add more table headers as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategoryData.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell align="left">{String(row.subcategoryName)}</TableCell>
                <TableCell align="left">
                  <img
                    src={row.imageUrl}
                    height="70px"
                    width="70px"
                    style={{ borderRadius: "15px" }}
                    loading="lazy"
                    alt={row.subcategoryName}
                  />
                </TableCell>
                {/* Add more table cells for additional data */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageTemplate>
  );
}

export default SubCategoryDetails;
