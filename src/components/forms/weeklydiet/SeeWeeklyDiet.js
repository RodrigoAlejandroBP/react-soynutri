import React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import Table from "./TableWeekly";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { getAllWeeklyDiets } from "../../../redux/ducks/weeklyDietsDucks";
import { getPatientInfo } from "../../../redux/ducks/patientsDucks";
import { getId } from "../../../redux/ducks/patientsDucks";

function formateaRut(rut) {
  var actual = rut.replace(/^0+/, "");
  if (actual !== "" && actual.length > 1) {
    var sinPuntos = actual.replace(/\./g, "");
    var actualLimpio = sinPuntos.replace(/-/g, "");
    var inicio = actualLimpio.substring(0, actualLimpio.length - 1);
    var rutPuntos = "";
    var i = 0;
    var j = 1;
    for (i = inicio.length - 1; i >= 0; i--) {
      var letra = inicio.charAt(i);
      rutPuntos = letra + rutPuntos;
      if (j % 3 === 0 && j <= inicio.length - 1) {
        rutPuntos = "." + rutPuntos;
      }
      j++;
    }
    var dv = actualLimpio.substring(actualLimpio.length - 1);
    rutPuntos = rutPuntos + "-" + dv;
  }
  return rutPuntos;
}

function Edad(FechaNacimiento) {
  var fechaNace = new Date(FechaNacimiento);
  var fechaActual = new Date();

  var mes = fechaActual.getMonth();
  var dia = fechaActual.getDate();
  var año = fechaActual.getFullYear();

  fechaActual.setDate(dia);
  fechaActual.setMonth(mes);
  fechaActual.setFullYear(año);

  let edad = Math.floor(
    (fechaActual - fechaNace) / (1000 * 60 * 60 * 24) / 365
  );

  return edad;
}

const SeeWeeklyDietStyled = styled.div`
  /* Hidde spinner number input Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hidde spinner number input Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  /* ------- */
  margin-bottom: 2em;
  .form {
    margin-left: 1em;
    margin-right: 1em;
  }
  .form-button {
    margin-top: 1em;
  }

  .title {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;
    font-family: yellowtail;
    font-size: 3.5em;
    /* color: var(--mainPurple); */
  }

  @media screen and (min-width: 600px) {
    .MuiGrid-root.margin.MuiGrid-item.MuiGrid-grid-md-1,
    .MuiGrid-root.MuiGrid-item.MuiGrid-grid-md-1 {
      display: none;
    }
    .texto {
      margin-right: 0.2px;
    }
    .semana {
      margin-top: 15px;
      margin-left: 15px;
    }
    .hola {
      margin-left: 0px;
    }
    .lunch-picker {
      margin-right: 0.1px;
    }

    .grid-invisible {
      display: none;
    }
  }
  @media screen and (min-width: 960px) {
    .grid-invisible {
      display: block;
    }
  }
  .name {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;
    font-size: 1em;
    /* color: var(--mainPurple); */
  }
`;

function getFecha(date) {
  let newDate = new Date(date);
  let month = (newDate.getMonth() + 1).toString();
  let day = (newDate.getDate() + 1).toString();
  let year = newDate.getFullYear().toString();
  let dayS = day.length > 1 ? day : `0${day}`;
  let monthS = month.length > 1 ? month : `0${month}`;
  return `${dayS}/${monthS}/${year}`;
}

export default function SeeWeeklyDiet({ match }) {
  const dispatch = useDispatch();
  const weeklyDiets = useSelector((store) => store.weeklyDiets.getweeklyDiets);
  const weeklyDietError = useSelector((store) => store.weeklyDiets.errors);
  const patientInfo = useSelector((state) => state.patients.patientInfo);

  React.useEffect(() => {
    dispatch(getPatientInfo(match.params.rut));
    dispatch(getAllWeeklyDiets(match.params.rut));
    dispatch(getPatientInfo(match.params.rut));
    dispatch(getId(match.params.rut));
  }, [dispatch, match]);
  const exists = useSelector((state) => state.patients.exists);
  if (exists === "error") {
    window.location.href = "/error";
  }

  var rows = [];

  if (weeklyDiets && weeklyDiets.length > 0) {
    for (let i = 0; i < weeklyDiets.length; i++) {
      rows.push({
        date: getFecha(weeklyDiets[i].date),
        action: "delete",
        dateF: weeklyDiets[i].date,
      });
    }
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"), {
    defaultMatches: true,
  });

  return (
    <SeeWeeklyDietStyled>
      <div>
        <Grid container justify="center">
          <Typography className="title" variant="h5" color="primary">
            Ver minuta semanal
          </Typography>
        </Grid>

        {patientInfo && patientInfo.names ? (
          <Grid container alignItems="center">
            <Grid item xs={12} container justify="center">
              <Typography className="name" variant="h5">
                <div>
                  <h1>
                    {patientInfo.names} {patientInfo.father_last_name}{" "}
                    {patientInfo.mother_last_name}
                  </h1>
                  <h2>
                    Rut: {formateaRut(patientInfo.rut)} Edad:{" "}
                    {Edad(patientInfo.birth_date)} años
                  </h2>
                </div>
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid container justify="center">
            <Grid item container>
              <Grid item xs={false} sm={3}></Grid>

              <Grid item xs={12} sm={6}>
                <Skeleton
                  variant="rect"
                  height={100}
                  style={{ borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={false} sm={3}></Grid>
            </Grid>
          </Grid>
        )}

        <br></br>

        <Grid container justify="center" spacing={isMobile ? 0 : 2}>
          <Grid item xs={12} sm={8} className="semana">
            {(weeklyDiets && weeklyDiets[0] === "error") ||
            weeklyDietError === "Error inesperado!" ? (
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <h2>Este usuario no tiene minutas semanales aún.</h2>
              </Grid>
            ) : weeklyDiets && weeklyDiets.length > 0 ? (
              <Table weeklyDiets={weeklyDiets}></Table>
            ) : (
              <Grid container justify="center" style={{ marginTop: 20 }}>
                <Grid item container>
                  <Grid item xs={false} sm={3}></Grid>

                  <Grid item xs={12} sm={6}>
                    <Skeleton
                      variant="rect"
                      height={200}
                      style={{ borderRadius: "5px" }}
                    />
                  </Grid>
                  <Grid item xs={false} sm={3}></Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    </SeeWeeklyDietStyled>
  );
}
