import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { Box } from "@mui/system";
import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function EventCard({ data, index, setUserEventsDash }) {
  const [open, setOpen] = React.useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [price, setPrice] = useState("");
  const [bookingType, setBookingType] = useState("normal");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const [ev, eventUpdate] = useState(false);

  function getAllEvents() {
    fetch("https://ltimindtree-backend.onrender.com/events")
      .then((response) => response.json())
      .then((data1) => {
        const filteredEvents = data1.events.filter(
          (event) => event?.uniqueId === data?.uniqueId
        );
        setUserEvents(filteredEvents);
        eventUpdate(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    getAllEvents();
  }, [open]);

  const userEmail = localStorage.getItem("userEmail");

  const handleUpdate = (event, index) => {
    event.preventDefault();
    handleClose();
    const eventData = {
      eventName,
      eventDate,
      eventDescription,
      price,
      bookingType,
      termsAccepted,
      userEmail,
    };
    fetch("https://ltimindtree-backend.onrender.com/events")
      .then((response) => response.json())
      .then((data) => {
        //  data.events=eventData;
        const tempData = data.events;
        tempData.splice(index, 1, eventData);
        setUserEventsDash(tempData)
        return fetch("https://ltimindtree-backend.onrender.com/updateevent", {
          method: "POST",
          body: JSON.stringify({ events: tempData }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .then(() => {
        console.log("done");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = (event, index) => {
    event.preventDefault();
    fetch("https://ltimindtree-backend.onrender.com/events")
      .then((response) => response.json())
      .then((data) => {
        const tempData = data.events;
        tempData.splice(index, 1);
        setUserEventsDash(tempData);
        return fetch("https://ltimindtree-backend.onrender.com/deleteevent", {
          method: "POST",
          body: JSON.stringify({ events: tempData }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .then((res) => {
        console.log("deleted");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Card
        sx={{
          width: "100%",
          mb: 2,
          boxShadow:
            "0px 0px 7px 1px rgb(0 0 0 / 15%), 0px 1px 1px 0px rgb(0 0 0 / 10%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
          border: "1px solid #d1d1d1",
        }}
      >
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "10px 0 0 10px", marginBottom: 0 }}
        >
          {data.eventName}
        </Typography>
        <Typography
          gutterBottom
          variant="p"
          component="p"
          sx={{ padding: "0 0 5px 10px" }}
        >
          {data.eventDate ? format(new Date(data.eventDate), "MM/dd/yyyy") : ""}
        </Typography>
        <CardMedia
          component="img"
          alt="green iguana"
          height="180"
          image="https://picsum.photos/450/180"
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {data.eventDescription}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardActions>
            <Button size="small" onClick={handleClickOpen}>
              Edit
            </Button>
            <Button
              size="small"
              onClick={(event) => handleDelete(event, index)}
            >
              Delete
            </Button>
          </CardActions>
          <Typography
            gutterBottom
            variant="h6"
            component="span"
            sx={{ padding: "0px 10px 0 0", marginBottom: 0 }}
          >
            Price: &#8377;{data.price}
          </Typography>
        </Box>
      </Card>
      <Dialog
        open={open}
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit Event
          </DialogContentText>
          <Box
            component="form"
            onSubmit={(event) => handleUpdate(event, index)}
            sx={{ mt: 3, width: "100%" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={7}>
                <TextField
                  autoComplete="given-name"
                  name="eventName"
                  required
                  fullWidth
                  id="eventName"
                  type="text"
                  defaultValue={userEvents[0]?.eventName}
                  onChange={(event) => setEventName(event.target.value)}
                  label="Event Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={eventDate}
                    onChange={(event) => setEventDate(event)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  defaultValue={userEvents[0]?.eventDescription}
                  onChange={(event) => setEventDescription(event.target.value)}
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  min="0"
                  defaultValue={userEvents[0]?.price}
                  onChange={(event) => setPrice(event.target.value)}
                  name="price"
                  label="Price"
                  id="price"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel id="demo-radio-buttons-group-label">
                  <b>Booking Type:</b>
                </FormLabel>
                <Radio
                  value={"normal"}
                  checked={bookingType === "normal"}
                  onChange={() => setBookingType("normal")}
                  name="radio-buttons"
                  inputProps={{ "aria-label": "A" }}
                />
                <FormLabel id="demo-radio-buttons-group-label">
                  Normal
                </FormLabel>
                <Radio
                  defaultValue={"premium"}
                  checked={bookingType === "premium"}
                  onChange={() => setBookingType("premium")}
                  name="radio-buttons"
                  inputProps={{ "aria-label": "A" }}
                />
                <FormLabel id="demo-radio-buttons-group-label">
                  Premium
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(event) =>
                        setTermsAccepted(event.target.checked)
                      }
                      required
                    />
                  }
                  label="I accept the terms & conditions"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Event
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
