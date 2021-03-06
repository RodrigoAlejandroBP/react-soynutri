import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import PersonIcon from "@material-ui/icons/Person";

const PatientMenuStyled = styled.div`
  margin-left: 1em;
  margin-right: 1em;
  .button-menu {
    color: white;
  }
  .menu-item:hover {
    background-color: var(--lightPurple);
    color: white;
  }
  .icon {
    margin-right: 0.2em;
  }
`;

export default function PatientMenu() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  return (
    <PatientMenuStyled>
      <Button
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        variant="text"
        className="button-menu"
      >
        <PersonIcon fontSize="inherit" className="icon" />
        Pacientes
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper className="paper">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    className="menu-item add"
                    onClick={handleClose}
                    component={Link}
                    to="/agregar_paciente"
                  >
                    Agregar paciente
                  </MenuItem>
                  <MenuItem
                    className="menu-item see"
                    onClick={handleClose}
                    component={Link}
                    to="/buscar_paciente/ver"
                  >
                    Ver paciente
                  </MenuItem>
                  <MenuItem
                    className="menu-item mod"
                    onClick={handleClose}
                    component={Link}
                    to="/buscar_paciente/modificar"
                  >
                    Modificar paciente
                  </MenuItem>
                  <MenuItem
                    className="menu-item del"
                    onClick={handleClose}
                    component={Link}
                    to="/buscar_paciente/eliminar"
                  >
                    Eliminar paciente
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </PatientMenuStyled>
  );
}
