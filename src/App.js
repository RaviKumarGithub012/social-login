import { useEffect, useState } from "react";
import "./App.css";
import { LinkedIn, LinkedInPopUp } from "react-linkedin-login-oauth2";
import QueryString from "query-string";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

const clientId = "7860yb5zz8zzqr";
const client_secret = "S3ZbQ8H2QmlZuJOa";

function App() {
  const params = QueryString.parse(window.location.search);
  const [state, setstate] = useState({
    code: "",
    errorMessage: "",
  });

  const handleSuccess = (data) => {
    setstate({ code: data.code, errorMessage: "" });
  };

  const handleFailure = (error) => {
    setstate({
      code: "",
      errorMessage: error.errorMessage,
    });
  };

  const getEmailAddress = async (access_token) => {
    fetch(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "access-control-allow-origin": "*",
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const linkedinLogin = async (code) => {
    console.log(code, "code");
    let data = `grant_type=authorization_code&code=${code}&redirect_uri=${window.location.origin}&client_id=${clientId}&client_secret=${client_secret}`;

    fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res) => getEmailAddress(res?.access_token))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (state?.code?.length > 0 && linkedinLogin) linkedinLogin(state?.code);
  }, [state, linkedinLogin]);

  if (params.code || params.error) {
    return <LinkedInPopUp />;
  }
  return (
    <div className="App">
      <LinkedIn
        clientId={clientId}
        onFailure={handleFailure}
        onSuccess={handleSuccess}
        redirectUri={window.location.origin}
      >
        <img
          src={linkedin}
          alt="Log in with Linked In"
          style={{ maxWidth: "180px" }}
        />
      </LinkedIn>
      {!state.code && <div>No code</div>}
      {state.code && <div>Code: {state.code}</div>}
      {state.errorMessage && <div>{state.errorMessage}</div>}
    </div>
  );
}

export default App;
