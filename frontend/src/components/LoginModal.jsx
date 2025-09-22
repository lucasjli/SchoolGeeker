import React from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Modal } from "bootstrap";

function LoginModal() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [signUpInfo, setSignUpInfo] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [signUpMsg, setSignUpMsg] = React.useState("");

  const { login } = useContext(UserContext);
  const [loginInfo, setLoginInfo] = React.useState({ email: "", password: "" });
  const [loginMsg, setLoginMsg] = React.useState("");

  React.useEffect(() => {
    if (!isSignUp) {
      google.accounts.id.initialize({
        client_id: "1012433519070-n0evss4h4iu3s1js0h99arh5e780596u.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(document.getElementById("google-login-btn"), {
        theme: "outline",
        size: "large",
        width: "100%"
      });
    }
  }, [isSignUp]);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoginMsg("");
    try {
      const res = await fetch("/api/Users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: loginInfo.email,
          Password: loginInfo.password
        })
      });
      if (res.ok) {
        const userObj = await res.json();
        login(userObj);
        setLoginMsg("Login successful!");
        setTimeout(() => {
          const modalEl = document.getElementById("loginModal");
          const modal = Modal.getOrCreateInstance(modalEl);
          modal.hide();
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) backdrop.parentNode.removeChild(backdrop);
        }, 1500);
      } else if (res.status === 401) {
        setLoginMsg("Email or password is incorrect!");
      } else {
        setLoginMsg("Login failed!");
      }
    } catch {
      setLoginMsg("Login failed!");
    }
  }

  async function handleSignUpSubmit(e) {
    e.preventDefault();
    setSignUpMsg("");
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      setSignUpMsg("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch("/api/Users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: signUpInfo.username,
          Email: signUpInfo.email,
          PasswordHash: signUpInfo.password
        })
      });
      if (res.ok) {
        const userObj = await res.json(); // 后端返回新用户信息
        login(userObj); // 更新全局状态
        setSignUpMsg("Sign up successful!");
        setTimeout(() => {
          const modalE2 = document.getElementById("loginModal");
          const modal = Modal.getOrCreateInstance(modalE2);
          modal.hide();
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) backdrop.parentNode.removeChild(backdrop);
        }, 1500);
      } else {
        setSignUpMsg("Sign up failed!");
      }
    } catch {
      setSignUpMsg("Sign up failed!");
    }
  }

  async function handleCredentialResponse(response) {
    // 前端将 Google ID Token 传到后端
    try {
      const res = await fetch("/api/Users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdToken: response.credential })
      });

      if (res.ok) {
        const user = await res.json();
        login(user);
        alert("Google login successful! Welcome, " + user.username);
        // 自动关闭弹窗
        setTimeout(() => {
          const modalEl = document.getElementById("loginModal");
          if (modalEl) {
            const modal = Modal.getOrCreateInstance(modalEl);
            modal.hide();
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) backdrop.parentNode.removeChild(backdrop);
          }
        }, 1500);
      } else {
        alert("Google login failed!");
        console.log(await res.text());
      }
    } catch {
      alert("Google login failed!");
    }
  }

  return (<div className="modal fade" id="loginModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-sm">
      <div className="modal-content rounded-4 shadow">
        <div className="modal-header border-0 justify-content-center">
          <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/WebsiteLogo.png" alt="Logo" width="60" className="mb-2" />
          <button type="button" className="btn-close position-absolute top-0 end-0 me-2 mt-2"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="text-center mb-3"><b
          className="text-muted">{isSignUp ? "Sign up for SchoolGeeker" : "Login to SchoolGeeker"}</b></div>
        <div className="modal-body px-4">
          {isSignUp ? (
            <form onSubmit={handleSignUpSubmit}>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="User Name"
                  required value={signUpInfo.username}
                  onChange={e => setSignUpInfo({ ...signUpInfo, username: e.target.value })} />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Email address"
                  required value={signUpInfo.email}
                  onChange={e => setSignUpInfo({ ...signUpInfo, email: e.target.value })} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" placeholder="Password"
                  required value={signUpInfo.password}
                  onChange={e => setSignUpInfo({ ...signUpInfo, password: e.target.value })} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" placeholder="Confirm Password"
                  required value={signUpInfo.confirmPassword}
                  onChange={e => setSignUpInfo({ ...signUpInfo, confirmPassword: e.target.value })} />
              </div>
              {signUpMsg && <div className="text-center text-danger mb-2">{signUpMsg}</div>}
              <button type="submit" className="btn btn-success w-100 mb-3 justify-content-center">Sign up</button>
            </form>) : (
            <>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Email address"
                    required value={loginInfo.email}
                    onChange={e => setLoginInfo({ ...loginInfo, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <input type="password" className="form-control" placeholder="Password"
                    required value={loginInfo.password}
                    onChange={e => setLoginInfo({ ...loginInfo, password: e.target.value })} />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="rememberCheck" />
                  <label className="form-check-label small" htmlFor="rememberCheck">Remember me</label>
                </div>
                {loginMsg && <div className="text-center text-danger mb-2">{loginMsg}</div>}
                <button type="submit" className="btn btn-primary w-100 mb-3 justify-content-center">Login
                </button>
              </form>
              <div className="text-center text-muted mb-3">or</div>
              <div id="google-login-btn"></div>
            </>
          )}
          <div className="text-center mt-3"><small> {isSignUp ? <>Already have an account? <a href="#"
            onClick={e => {
              e.preventDefault();
              setIsSignUp(false);
            }}>Login</a></> : <>Don't
              have an account? <a href="#" onClick={e => {
                e.preventDefault();
                setIsSignUp(true);
              }}>Sign up</a></>} </small></div>
        </div>
      </div>
    </div>
  </div>);
}

export default LoginModal;