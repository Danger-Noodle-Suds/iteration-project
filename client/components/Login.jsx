import React from "react";
import { useHistory } from "react-router-dom";

const getDateDiff = (date1, date2) => {
  return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
};

function Login({
  setFirstName,
  setAge,
  email,
  setEmail,
  password,
  setPassword,
  setEmergencyContactName,
  setEmergencyContactPhone,
  setAddiction,
  setMissedLogin,
  setMoodHistory,
  setIsLoggedIn,
}) {
  const history = useHistory();

  const login = () => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        setPassword("");
        setEmergencyContactName(data.emergencyContactName);
        setEmergencyContactPhone(data.emergencyContactPhone);
        setAddiction(data.addiction);
        setFirstName(data.firstName);
        // make functionality for missed login they will send last login date
        // ! setMissedLogin(getDateDiff(new Date(data.lastLoginDate), new Date()));
        setIsLoggedIn(true);
        // ! setMoodHistory(data.moodHistory);
        history.push("/user");
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="login">
      <div id="space">
        <label htmlFor="email">Email </label>
        <input
          id="email"
          type="email"
          placeholder="MyEmail@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        {/* </div>
      <div id="space"> */}
        <label htmlFor="password">Password </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        {/* </div> */}
        <button type="submit" onClick={(e) => login()}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Login;
