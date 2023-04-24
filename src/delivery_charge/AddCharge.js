import React from "react";
import SelectInput from "../components/reusable/SelectInput";
import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import { CONDITION } from "../Constants";
import { useEffect } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import SaveBtn from "../components/reusable/SaveBtn";
import Swal from "sweetalert2";

function AddCharge({ onClose }) {
  const [condition, setCondition] = useState("");
  const [criteria, setCriteria] = useState("");
  const [criteriaList, setCriteriaList] = useState([]);
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");

  useEffect(() => {
    getSettingsData();
  }, []);

  const getSettingsData = async () => {
    const data = await getDoc(doc(db, "Settings", "UserSettings"));
    setCriteriaList(data.data().chargeCriteriaList);
  };

  const onSave = async () => {
    const chargeRef = collection(db, "DeliveryCharge");
    if (!deliveryCharge || !criteria || !condition || !value) {
        return Swal.fire('Failed!', 'Please fill all required details', 'error')
    }
    await addDoc(chargeRef, {
      deliveryCharge,
      criteria,
      condition,
      value,
      value2
    }).then(() => {
      Swal.fire("Submitted!", "Added new delivery charge", "success");
      onClose();
    });
  };
  const isRangeSelected = () => condition === "IN RANGE";

  return (
    <Grid container spacing={2}>
      <Grid item xs={2.5}>
        <SelectInput
          label="Criteria"
          sx={{ width: "100%" }}
          name={"criteria"}
          value={criteria}
          data={criteriaList}
          required
          onChange={(e) => setCriteria(e.target.value)}
        />
      </Grid>
      <Grid item xs={isRangeSelected() ? 2 : 3.5}>
        <SelectInput
          label="Condition"
          sx={{ width: "100%" }}
          name={"condition"}
          value={condition}
          data={Object.values(CONDITION)}
          required
          onChange={(e) => setCondition(e.target.value)}
        />
      </Grid>

      {isRangeSelected() ? (
        <>
          <Grid item xs={2}>
            <TextField
              sx={{ width: "100%" }}
              label="Value 1"
              type="number"
              value={value}
              required
              onChange={(e) => setValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              sx={{ width: "100%" }}
              label="Value 2"
              type="number"
              value={value2}
              required
              onChange={(e) => setValue2(e.target.value)}
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={2.5}>
          <TextField
            sx={{ width: "100%" }}
            label="Value"
            type="number"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Grid>
      )}
      <Grid item sx={{ display: "grid" }} xs={0.5}>
        {<b style={{ margin: "auto" }}>{"=>"}</b>}
      </Grid>
      <Grid item xs ={2.5}>
        <TextField
          sx={{ width: "100%" }}
          label="Delivery Charge"
          type="number"
          required
          value={deliveryCharge}
          onChange={(e) => setDeliveryCharge(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <SaveBtn onSave={onSave} />
      </Grid>
    </Grid>
  );
}

export default AddCharge;
