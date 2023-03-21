import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {

  console.log("app")
  return (
   <>
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
    <Router>
      <Switch>
        <Route exact path="/" render={props => <Login {...props}/>} />
        <Route path="/dashboard" render={props => <Dashboard {...props}/>} /> 
        <Route path="/register" render={props => <Register {...props}/>} />
      </Switch>
    </Router>
    </>
  );
}

export default App;
