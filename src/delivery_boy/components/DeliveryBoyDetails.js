import PageTemplate from "../../pages/reusable/PageTemplate";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Add this import
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase-config";

function DeliveryBoyDetails() {
  const { id } = useParams(); // Get the delivery boy's ID from the URL

  console.log("Delivery Boy ID:", id); // Add this line to check the ID

  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchDeliveryBoy = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "DeliveryBoy"));
        const deliveryBoyData = querySnapshot.docs.map((doc) => doc.data());

        // Find the delivery boy with the matching ID
        const selectedDeliveryBoy = deliveryBoyData.find((db) => db.id === id);

        if (selectedDeliveryBoy) {
          setDeliveryBoy(selectedDeliveryBoy);
          const storageRef = storage.ref();
          const imageRef = storageRef.child(selectedDeliveryBoy.profilePic);
          const url = await imageRef.getDownloadURL();
          setImageUrl(url);
        } else {
          console.log("Delivery boy not found");
        }
      } catch (error) {
        console.log("Error fetching delivery boys:", error);
      }
    };

    fetchDeliveryBoy();
  }, [id]);

  return (
    <PageTemplate>
      <div>
        {deliveryBoy ? (
          <div>
            <h1>{`${deliveryBoy.name} Detail`}</h1>
            <p>Name: {deliveryBoy.name}</p>
            <p>DL Number: {deliveryBoy.dlnumber}</p>
            <p>Phone Number: {deliveryBoy.phoneNumber}</p>
            <p>Date Of Joining: {deliveryBoy.joinDate}</p>
            <p>Address: {deliveryBoy.address}</p>
            {imageUrl && <img src={imageUrl} alt="Delivery Boy" />}
            {/* Display other details as needed */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </PageTemplate>
  );
}

export default DeliveryBoyDetails;
