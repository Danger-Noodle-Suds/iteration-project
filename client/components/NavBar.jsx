import React from "react";
import { Nav, NavLink, NavMenu, NavBtn, NavBtnLink } from "./NavBarElements";

function NavBar({
  setFirstName,
  setAge,
  setContactName,
  setContactPhone,
  setMissedLogin,
  setAddiction,
  setMoodHistory,
  setJournalHistory,
  setIsLoggedIn,
  isLoggedIn,
}) {
  function logOut() {
    setFirstName("");
    setAge(0);
    setContactName("");
    setContactPhone(0);
    setMissedLogin(0);
    setAddiction("");
    setMoodHistory([]);
    setJournalHistory([]);
    setIsLoggedIn(false);
  }

  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>SUD app</h1>
        </NavLink>
        <NavMenu>
          {isLoggedIn === false && <NavLink to="/">Home</NavLink>}
          {isLoggedIn === true && <NavLink to="/user">Dashboard</NavLink>}
          {isLoggedIn === false && <NavLink to="/login">Login</NavLink>}
        </NavMenu>
        {isLoggedIn === true && (
          <NavBtn onClick={() => logOut()}>
            <NavBtnLink to="/login">Log Out</NavBtnLink>
          </NavBtn>
        )}
        {isLoggedIn === false && (
          <NavBtn>
            <NavBtnLink to="/signup">Sign Up</NavBtnLink>
          </NavBtn>
        )}
      </Nav>
    </>
  );
}

export default NavBar;
