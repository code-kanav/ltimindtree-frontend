import "./App.css";
import React, { useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "./listItems";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Radio,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ToastMessage from "./components/Toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoutIcon from "@mui/icons-material/Logout";
import EventCard from "./components/eventCard";
import { v4 as uuidv4 } from "uuid";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [price, setPrice] = useState("");
  const [bookingType, setBookingType] = useState("normal");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const [ev, eventUpdate] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  function getAllEvents() {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => {
        const filteredEvents = data.events.filter(
          (event) => event.userEmail === userEmail
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
  }, []);

  const notify = React.useCallback((type, message) => {
    ToastMessage({ type, message });
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    const uniqueId = uuidv4();
    const eventData = {
      eventName,
      eventDate,
      eventDescription,
      price,
      bookingType,
      termsAccepted,
      userEmail,
      uniqueId,
    };
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => {
        const events = [...data.events, eventData];
        setUserEvents([...data.events, eventData]);
        const newData = { events };
        return fetch("http://localhost:3000/createevents", {
          method: "POST",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .then(() => {
        notify("success", "Event Added!");
        setTimeout(() => {
          getAllEvents();
        }, 500);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  return (
    <ThemeProvider theme={mdTheme}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        draggable={false}
        pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <Link color="inherit" href="/">
              <IconButton color="inherit" onClick={() => localStorage.clear()}>
                <LogoutIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography component="h1" variant="h5">
                    Add Event
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
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
                          value={eventName}
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
                          value={eventDescription}
                          onChange={(event) =>
                            setEventDescription(event.target.value)
                          }
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
                          value={price}
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
                          value="normal"
                          checked={bookingType === "normal"}
                          onChange={() => setBookingType("normal")}
                          name="radio-buttons"
                          inputProps={{ "aria-label": "A" }}
                        />
                        <FormLabel id="demo-radio-buttons-group-label">
                          Normal
                        </FormLabel>
                        {/* <br /> */}
                        <Radio
                          value="premium"
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
                      Add Event
                    </Button>
                  </Box>
                </Paper>
                <Paper
                  sx={{
                    mt: 3,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography component="span" variant="h6">
                    Base Price for all Normal Events: &#8377;{" "}
                    {userEvents.filter((e) => e.bookingType === "normal")
                      .length !== 0
                      ? userEvents
                        .filter((e) => e.bookingType === "normal")
                        .map((item) => parseInt(item.price))
                        .reduce((prev, next) => prev + next)
                      : 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "512px",
                  }}
                >
                  <Typography component="span" variant="h6">
                    Premium Events
                  </Typography>
                  <Box
                    sx={{
                      m: 0,
                      mt: 1,
                      height: "505px",
                      overflow: "scroll",
                      p: 2,
                      pt: 1,
                    }}
                  >
                    {ev
                      ? userEvents
                        .filter((e) => e.bookingType === "premium")
                        .map((event, i) => (
                          <div key={i}>
                            <EventCard
                              data={event}
                              index={i}
                              setUserEventsDash={setUserEvents}
                            />
                          </div>
                        ))
                      : ""}
                  </Box>
                </Paper>
                <Paper
                  sx={{
                    mt: 3,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography component="h6" variant="h6">
                    Base Price for all Premium Events: &#8377;{" "}
                    {userEvents.filter((e) => e.bookingType === "premium")
                      .length !== 0
                      ? userEvents
                        .filter((e) => e.bookingType === "premium")
                        .map((item) => parseInt(item.price))
                        .reduce((prev, next) => prev + next)
                      : 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography component="h1" variant="h5">
                    Normal Events
                  </Typography>
                  <Box sx={{ mt: 3, height: "auto", overflow: "scroll" }}>
                    <div className="normalBox">
                      {ev
                        ? userEvents
                          .filter((e) => e.bookingType === "normal")
                          .map((event, j) => (
                            <div key={j}>
                              <EventCard
                                data={event}
                                index={parseInt(j) + 7}
                                setUserEventsDash={setUserEvents}
                              />
                            </div>
                          ))
                        : ""}
                    </div>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
