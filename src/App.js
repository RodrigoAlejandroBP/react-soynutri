import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import jwtDecode from "jwt-decode";

// material ui stuff
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { esEs } from "@material-ui/core/locale";
import purple from "@material-ui/core/colors/purple";
import deepPurple from "@material-ui/core/colors/deepPurple";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// components
import Navbar from "./components/navbar/Navbar";
import Error from "./components/Error";
import HomeDashboard from "./components/HomeDashboard";
import Login from "./components/forms/Login";

//patient
import AddPatient from "./components/forms/patient/AddPatient";
import SeePatient from "./components/views/patient/SeePatient";
import ModifyPatient from "./components/forms/patient/ModifyPatient";
import DeletePatient from "./components/forms/patient/DeletePatient";
import SearchPatient from "./components/views/patient/SearchPatient";
//Patient documents
import PatientControl from "./components/patients/Control";
import PatientDailyDiets from "./components/patients/DailyDiets";
import PatientWeeklyDiets from "./components/patients/WeeklyDiets";

// controls
import AddControl from "./components/forms/control/AddControl";
import ModifyControl from "./components/forms/control/ModifyControl";
import SearchControl from "./components/forms/control/SearchControl";
import ShowControl from "./components/forms/control/ShowControl";
import DeleteControl from "./components/forms/control/DeleteControl";

// daily diets
import AddDailyDiet from "./components/forms/dailydiet/AddDailyDiet";
import ModifyDailyDiet from "./components/forms/dailydiet/ModifyDailyDiet";
import SeeDailyDiet from "./components/forms/dailydiet/SeeDailyDiet";
import DeleteDailyDiet from "./components/forms/dailydiet/DeleteDailyDiet";

//Weekly diets

import WeeklyDiet from "./components/forms/weeklydiet/AddWeeklyDiet";
import ModifyWeeklyDiet from "./components/forms/weeklydiet/ModifyWeeklyDiet";
import DeleteWeeklyDiet from "./components/forms/weeklydiet/DeleteWeeklyDiet";
import SeeWeeklyDiet from "./components/forms/weeklydiet/SeeWeeklyDiet";
import SearchWeeklyDiets from "./components/forms/weeklydiet/SearchWeeklyDiets";

// axios
import axios from "axios";

// redux
import { Provider } from "react-redux";
import generateStore from "./redux/store";
import { logoutUser } from "./redux/ducks/authDucks";

// profile
import Profile from "./components/patients/Profile";

axios.defaults.baseURL =
  "https://us-central1-back-f0378.cloudfunctions.net/api";
//axios.defaults.baseURL = "https://pokeapi.co/api/v2";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? "dark" : "light";
  const mainPrimaryColor = darkState ? purple[500] : "#58157c";
  const mainSecondaryColor = darkState ? deepPurple[500] : deepPurple[900];

  const theme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
    esEs,
  });

  const handleThemeChange = () => {
    setDarkState(!darkState);
    localStorage.theme = !darkState ? "dark" : "light";
  };

  React.useEffect(() => {
    const obtenerInfo = () => {
      if (localStorage.theme === "dark") {
        setDarkState(true);
      } else if (localStorage.theme === "light") {
        setDarkState(false);
      } else {
        setDarkState(prefersDarkMode ? true : false);
        localStorage.theme = prefersDarkMode ? "light" : "dark";
      }
    };
    obtenerInfo();
  }, [prefersDarkMode, setDarkState]);

  const store = generateStore();

  // get the token when the app starts
  const token = localStorage.FBIdToken;
  if (token) {
    const decodedToken = jwtDecode(token);
    if (localStorage.rol === "/soynutri-adm") {
      if ((decodedToken.auth_time + 86400) * 1000 < Date.now()) {
        // 1 day of expiration for admin
        store.dispatch(logoutUser());
        window.location.href = "/login";
      } else {
        axios.defaults.headers.common["Authorization"] = token;
      }
    } else if ((localStorage.rol = "/patient")) {
      // 30 days of expiration for patient
      if ((decodedToken.auth_time + 86400 * 30) * 1000 < Date.now()) {
        store.dispatch(logoutUser());
        window.location.href = "/login";
      } else {
        axios.defaults.headers.common["Authorization"] = token;
      }
    }
  }

  const template = (view, rol) => {
    switch (rol) {
      case "admin":
        if (localStorage.rol === "/soynutri-adm") {
          return view;
        } else {
          return Error;
        }
        break;
      case "patient":
        if (localStorage.rol === "/patient") {
          return view;
        } else {
          return Error;
        }
        break;
      case "unknown":
        return view;
        break;
      default:
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Provider store={store}>
          <Navbar darkState={darkState} handleThemeChange={handleThemeChange} />

          <Switch>
            <Route path="/" exact component={HomeDashboard} />

            <Route path="/login" component={Login} />

            <Route
              path="/agregar_paciente"
              exact
              component={template(AddPatient, "admin")}
            />
            <Route
              path="/buscar_paciente/:action"
              exact
              component={template(SearchPatient, "admin")}
            />
            <Route
              path="/ver_paciente/:rut/:elim"
              exact
              component={SeePatient}
            />
            <Route
              path="/modificar_paciente/:rut"
              exact
              component={ModifyPatient}
            />
            <Route path="/borrar_paciente" exact component={DeletePatient} />

            <Route path="/agregar_control/:rut" exact component={AddControl} />
            <Route
              path="/modificar_control/:rut"
              exact
              component={ModifyControl}
            />
            <Route
              path="/eliminar_control/:rut"
              exact
              component={DeleteControl}
            />
            <Route
              path="/buscar_control/:action"
              exact
              component={SearchControl}
            />
            <Route path="/ver_control/:rut" exact component={ShowControl} />

            <Route
              path="/agregar_pauta_diaria/:rut"
              exact
              component={AddDailyDiet}
            />
            <Route
              path="/ver_pauta_diaria/:rut"
              exact
              component={SeeDailyDiet}
            />
            <Route
              path="/modificar_pauta_diaria/:rut"
              exact
              component={ModifyDailyDiet}
            />
            <Route
              path="/eliminar_pauta_diaria/:rut"
              exact
              component={DeleteDailyDiet}
            />
            <Route path="/carnet" exact component={PatientControl} />
            <Route path="/pauta_diaria" exact component={PatientDailyDiets} />
            <Route
              path="/minuta_semanal"
              exact
              component={PatientWeeklyDiets}
            />
            <Route path="/perfil" exact component={Profile} />
            <Route
              path="/agregar_minuta_semanal/:rut"
              exact
              component={WeeklyDiet}
            />
            <Route
              path="/modificar_minuta_semanal/:rut"
              exact
              component={ModifyWeeklyDiet}
            />
            <Route
              path="/eliminar_minuta_semanal/:rut"
              exact
              component={DeleteWeeklyDiet}
            />
            <Route
              path="/ver_minuta_semanal/:rut"
              exact
              component={SeeWeeklyDiet}
            />
            <Route
              path="/buscar_minuta_semanal/:action"
              exact
              component={SearchWeeklyDiets}
            />

            <Route component={Error}></Route>
          </Switch>
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

//<Route path="/ver_minuta_semanal" exact component = {SeeWeeklyDiet} />
