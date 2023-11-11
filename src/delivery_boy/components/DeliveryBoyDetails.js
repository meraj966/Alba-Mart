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
  TextField,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";

function DeliveryBoyDetails() {
  const { id } = useParams();

  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);


  const [filteredOrderData, setFilteredOrderData] = useState(null);

  useEffect(() => {
    const fetchDeliveryBoy = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "DeliveryBoy"));
        const deliveryBoyData = querySnapshot.docs.map((doc) => doc.data());

        const selectedDeliveryBoy = deliveryBoyData.find((db) => db.id === id);

        if (selectedDeliveryBoy) {
          setDeliveryBoy(selectedDeliveryBoy);
          fetchOrderData(selectedDeliveryBoy.id);
        } else {
          console.log("Delivery boy not found");
        }
      } catch (error) {
        console.log("Error fetching delivery boys:", error);
      }
    };

    const fetchOrderData = async (deliveryBoyId) => {
      try {
        const ordersQuery = query(collection(db, "Order"), where("deliveryBoy", "==", deliveryBoyId));
        const orderSnapshot = await getDocs(ordersQuery);
        const orderData = orderSnapshot.docs.map((doc) => doc.data());
        setOrderData(orderData);
      } catch (error) {
        console.log("Error fetching order data:", error);
      }
    };

    fetchDeliveryBoy();
  }, [id]);

  const handleFilter = () => {
    if (startDate && endDate) {
      const filteredOrders = orderData.filter((order) => {
        const orderDate = new Date(order.deliveryDate).getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return orderDate >= start && orderDate <= end;
      });

      setFilteredOrderData(filteredOrders);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilteredOrderData(null);
  };

  const exportToExcel = () => {
    const fileName = `DeliveryBoy_${id}_Details.xlsx`;
    const ws = XLSX.utils.json_to_sheet((filteredOrderData || orderData).map((order) => ({
      "Order Number": "AM-" + order.orderNumber,
      "Cust Name": order.userName,
      "Cust Number": order.userMoNo,
      "Delivery Status": order.orderStatus,
      "Amount": order.totalRate,
      "Payment Mode": order.paymentType,
      "Delivery Date": order.deliveryDate ? order.deliveryDate.split(" ")[0] : "",
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <PageTemplate>
      <div>
        {deliveryBoy ? (
          <div>
            <h2 style={{ marginTop: -60 }}>{`${deliveryBoy.name} Detail`}</h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "10px", textAlign: "center" }}>
                <p>Profile Image</p>
                <div className="image-container" style={{ border: "1px solid black" }}>
                  <img
                    src={deliveryBoy.profileImageFile}
                    alt="profile.jpg"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginRight: "10px", textAlign: "center" }}>
                <p>DL Front Image</p>
                <div className="image-container" style={{ border: "1px solid black" }}>
                  <img
                    src={deliveryBoy.dlImageFrontFile}
                    alt="dl_front.jpg"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p>DL Back Image</p>
                <div className="image-container" style={{ border: "1px solid black" }}>
                  <img
                    src={deliveryBoy.dlImageBackFile}
                    alt="dl_back.jpg"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                    }}
                  />
                </div>
              </div>
            </div>
            <hr />
            <strong style={{ fontSize: "15px" }}>
              <p style={{ fontSize: "15px" }}>Name: {deliveryBoy.name}</p>
              <p style={{ fontSize: "15px" }}>DL Number: {deliveryBoy.dlnumber}</p>
              <p style={{ fontSize: "15px" }}>Phone Number: {deliveryBoy.phoneNumber}</p>
              <p style={{ fontSize: "15px" }}>Date Of Joining: {deliveryBoy.joinDate}</p>
              <p style={{ fontSize: "15px" }}>Address: {deliveryBoy.address}</p>
            </strong>
            <hr />
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ marginRight: '8px' }}
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ marginRight: '8px' }}
            />
            <Button variant="contained" onClick={handleFilter} sx={{ marginRight: '8px' }}>
              Filter
            </Button>
            <Button
              variant="contained"
              onClick={handleClear}
              sx={{ backgroundColor: 'red', color: 'white', marginRight: '20px' }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={exportToExcel}
              sx={{ backgroundColor: '#4caf50', color: 'white' }}
            >
              Export to Excel
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Order Number</strong></TableCell>
                    <TableCell><strong>Cust Name</strong></TableCell>
                    <TableCell><strong>Cust Number</strong></TableCell>
                    <TableCell><strong>Delivery Status</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Payment Mode</strong></TableCell>
                    <TableCell><strong>Delivery Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(filteredOrderData || orderData).map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{"AM-" + order.orderNumber}</TableCell>
                      <TableCell>{order.userName}</TableCell>
                      <TableCell>{order.userMoNo}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>{order.totalRate}</TableCell>
                      <TableCell>{order.paymentType}</TableCell>
                      <TableCell align="left">
                        {order && order.deliveryDate ? order.deliveryDate.split(" ")[0] : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </PageTemplate>
  );
}

export default DeliveryBoyDetails;
