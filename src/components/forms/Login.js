import React from "react";
import styled from "styled-components";

import { useForm } from "react-hook-form";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// redux
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/ducks/authDucks";

const AddPatientStyled = styled.div`
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: purple;
    -webkit-box-shadow: 0 0 0px 1000px #a9a9a9 inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  margin-bottom: 2em;
  .form {
    margin-left: 1em;
    margin-right: 1em;
  }
  .form-button {
    margin-top: 1em;
    margin-left: auto;
    margin-right: auto;
  }
  .title-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    margin-bottom: 1em;
    font-family: yellowtail;
    font-size: 3.5em;
    /* color: var(--mainPurple); */
  }
`;

export default function AddPatient() {
  const { register, errors, handleSubmit } = useForm();
  // redux
  const dispatch = useDispatch();
  const onSubmit = (userData) => {
    console.log(userData);
    dispatch(loginUser(userData));
  };

  const reqmsg = "Campo obligatorio";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"), {
    defaultMatches: true,
  });

  return (
    <AddPatientStyled>
      <form
        autoComplete="off"
        className="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container justify="center">
          <Typography className="title" variant="h5" color="primary">
            Inicia sesión en SoyNutri
          </Typography>
        </Grid>

        <Grid container>
          <Grid item container justify="center" spacing={isMobile ? 0 : 2}>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <TextField
                name="rut"
                type="text"
                label="Rut"
                variant="outlined"
                margin="dense"
                fullWidth
                error={errors.rut}
                helperText={
                  errors.rut ? errors.rut.message : "Sin puntos ni guión"
                }
                inputRef={register({
                  required: { value: true, message: reqmsg },
                })}
              />
            </Grid>
          </Grid>

          <Grid item container justify="center" spacing={isMobile ? 0 : 2}>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <TextField
                name="password"
                type="password"
                label="Contraseña"
                variant="outlined"
                margin="dense"
                fullWidth
                error={errors.password}
                helperText={errors.password ? errors.password.message : ""}
                inputRef={register({
                  required: { value: true, message: reqmsg },
                })}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container alignItems="center">
          <Button
            className="form-button"
            variant="outlined"
            type="submit"
            color="primary"
          >
            Iniciar Sesión
          </Button>
        </Grid>
      </form>
    </AddPatientStyled>
  );
}
