import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ToastMessage from "./components/Toast";
function Copyright(props) {
  return (
    <Typography variant="body2" color="text" align="center" {...props}>
      {'Password Hint:Qwertyuiop@1'}
    </Typography>
  );
}
function Register() {
  const theme = createTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const validatePassword = () => {
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError(false);
      console.log("passwordError", passwordError)
    } else {
      setPasswordError(true);
      console.log("passwordError", passwordError)
    }
  };

  const notify = React.useCallback((type, message) => {
    ToastMessage({ type, message });
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    validateEmail();
    validatePassword();
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      notify("error", "passwords do not match.");
      return;
    }
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        'x-cors-api-key': 'temp_e7774af2e127acf864392117f99e00c3',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const emailExists = data.users.some((user) => user.email === email);
        if (emailExists || email === "") {
          setErrorMessage("Email already exists. Please choose a different email.");
          notify("error", "Email already exists.");
        }
        else {
          if (passwordError === false || emailError === false) {
            notify("error", "enter valid email and pass");
          }
          else {
            const userData = { email, password, confirmPassword };
            fetch("http://localhost:3000/users", {
              method: "GET",
              headers: {
                'x-cors-api-key': 'temp_e7774af2e127acf864392117f99e00c3',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            })
              .then((response) => response.json())
              .then((data) => {
                const users = [...data.users, userData];
                const newData = { users };
                return fetch("http://localhost:3000/createusers", {
                  method: "POST",
                  headers: {
                    'x-cors-api-key': 'temp_e7774af2e127acf864392117f99e00c3',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(newData),
                });
              })
              .then(() => {
                notify("success", "Registration successful. Please login!");
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        }

      })
  };

  return (
    <ThemeProvider theme={theme}>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  autoComplete="new-password"
                />
                {/* <span>{passwordError}</span> */}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  fullWidth
                  name="confirm password"
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/"> Already have an account? Log in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Register;
