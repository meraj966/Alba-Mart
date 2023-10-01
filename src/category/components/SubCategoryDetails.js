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
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSubcategory from './EditSubcategory';

function SubCategoryDetails() {
    const { id } = useParams();
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [editSubcategoryData, setEditSubcategoryData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Create a reference to the specific category document
                const categoryDocRef = doc(db, "category", id);

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
                }
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };

        fetchData();
    }, [id, editSubcategoryData]); // Add editSubcategoryData to the dependency array

    const handleEdit = (row) => {
        // Set the data for the subcategory to be edited
        setEditSubcategoryData({
            subcategoryName: row.subcategoryName,
            imageUrl: row.imageUrl,
        });
    };

    const handleDelete = async (row) => {
        // Show a confirmation dialog using Swal
        const result = await Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure you want to delete ${row.subcategoryName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'No, cancel',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                // Delete the corresponding data from the database
                const categoryDocRef = doc(db, "category", id);
                const categoryDoc = await getDoc(categoryDocRef);

                if (categoryDoc.exists()) {
                    const subCategoryMap = categoryDoc.data().subCategory || {};
                    delete subCategoryMap[row.subcategoryName];

                    // Update the database document with the new data
                    await updateDoc(categoryDocRef, { subCategory: subCategoryMap });

                    // Show a success message
                    Swal.fire('Deleted!', `${row.subcategoryName} has been deleted.`, 'success');
                }
            } catch (error) {
                console.error("Error deleting subcategory:", error);
                // Show an error message
                Swal.fire('Error', 'An error occurred while deleting the subcategory.', 'error');
            }
        }
    };

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
                            <TableCell align="left" style={{ minWidth: "100px" }}>
                                <strong>Action</strong>
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
                                <TableCell align="left">
                                    <EditIcon
                                        onClick={() => handleEdit(row)}
                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                    />
                                    <DeleteIcon
                                        onClick={() => handleDelete(row)}
                                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                                    />
                                </TableCell>
                                {/* Add more table cells for additional data */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {editSubcategoryData && (
                <EditSubcategory
                    closeModal={() => setEditSubcategoryData(null)}
                    subcategoryData={editSubcategoryData}
                    categoryId={id}
                />
            )}
        </PageTemplate>
    );
}

export default SubCategoryDetails;
