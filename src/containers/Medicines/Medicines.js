import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as yup from "yup";
import { Form, Formik, useFormik } from "formik";

function Medicines(props) {
  const [open, setOpen] = useState(false);
  const [dopen, setDOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [data, setData] = useState([]);
  const [did, setDid] = useState();
  const [update, setUpdate] = useState(false);
  const [uid, setUid] = useState();
  const [filterData, setFilterData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDOpen(false);
  };

  const handleDClickOpen = (params) => {
    setDOpen(true);
    setDid(params.id);
  };

  const handleSubmit = (values) => {
    let data = {
      id: Math.floor(Math.random() * 1000),
      name: values.name,
      med_price: values.med_price,
      quantity: values.quantity,
      expiry: values.expiry,
    };

    console.log(data);

    let localData = JSON.parse(localStorage.getItem("medicines"));

    if (localData === null) {
      localStorage.setItem("medicines", JSON.stringify([data]));
    } else {
      localData.push(data);
      localStorage.setItem("medicines", JSON.stringify(localData));
    }

    //console.log(localData);

    //localStorage.setItem("medicines", JSON.stringify(data));

    handleClose();
    setName("");
    setPrice("");
    setQuantity("");
    setExpiry("");

    getData();
  };

  const handleDelete = () => {
    let localData = JSON.parse(localStorage.getItem("medicines"));

    let fData = localData.filter((l, i) => l.id !== did);

    localStorage.setItem("medicines", JSON.stringify(fData));

    handleClose();
    setDid();
    getData();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "med_price", headerName: "Price", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    { field: "expiry", headerName: "Expiry", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => handleDClickOpen(params)}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => handleEdit(params.row)}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const getData = () => {
    let localData = JSON.parse(localStorage.getItem("medicines"));

    if (localData !== null) {
      setData(localData);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let schema = yup.object().shape({
    name: yup.string().required("Please enter medicine name."),
    med_price: yup.string().required("Please enter medicine price."),
    quantity: yup.string().required("Please enter medicine quantity."),
    expiry: yup.string().required("Please enter medicine expiry."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      med_price: "",
      quantity: "",
      expiry: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (update) {
        handleUpdateData(values);
      } else {
        handleSubmit(values);
      }
      //alert(JSON.stringify(values, null, 2));
    },
  });

  const handleUpdateData = (values) => {
    let localData = JSON.parse(localStorage.getItem("medicines"));

    let uData = localData.map((l) => {
      if (l.id === uid) {
        return { id: uid, ...values };
      } else {
        return l;
      }
    });

    localStorage.setItem("medicines", JSON.stringify(uData));

    setOpen(false);
    setUpdate(false);
    setUid();
    getData();
  };

  const handleEdit = (params) => {
    console.log(params);
    setUid(params.id);
    setOpen(true);
    formik.setValues({
      name: params.name,
      med_price: params.med_price,
      quantity: params.quantity,
      expiry: params.expiry,
    });

    setUpdate(true);

    // console.log(uid);
  };

  const handleSearch = (val) => {
    let localData = JSON.parse(localStorage.getItem("medicines"));

    let fData = localData.filter((l) => (
      l.id.toString().includes(val) || 
      l.name.toString().toLowerCase().includes(val.toLowerCase()) ||
      l.med_price.toString().includes(val) ||
      l.quantity.toString().includes(val) ||
      l.expiry.toString().includes(val)
    ))
    
    setFilterData(fData)
  }

  let finalData = filterData.length > 0 ? filterData : data
  
  return (
    <div>
      <TextField
        autoFocus
        margin="dense"
        id="search"
        name="search"
        label="Search Medicine"
        fullWidth
        variant="standard"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Medicines
      </Button>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={finalData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Medicines</DialogTitle>
        <Formik values={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                value={formik.values.name}
                name="name"
                label="Medicine name"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
              />
              {formik.errors.name ? <p>{formik.errors.name}</p> : null}
              <TextField
                autoFocus
                margin="dense"
                value={formik.values.med_price}
                id="med_price"
                name="med_price"
                label="Medicine price"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="quantity"
                value={formik.values.quantity}
                name="quantity"
                label="Medicine quantity"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="expiry"
                value={formik.values.expiry}
                name="expiry"
                label="Medicine expiry"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
              />
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogActions>
            </DialogContent>
          </Form>
        </Formik>
      </Dialog>
      <Dialog
        open={dopen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to delete?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Medicines;
