import { jwtDecode } from "jwt-decode";
import { useAppStore } from "./store";

const URL = "http://85.208.51.126:3001/api";
// export const URL = "http://localhost:3001/api";

const isTokenValid = (token) => {
  try {
    let { exp } = jwtDecode(token);
    return Date.now() <= exp * 1000;
  } catch (err) {
    return false;
  }
};

export const auth = async (prefix, data) => {
  // prefix = verifyCode || login
  try {
    let res = await fetch(`${URL}/user/v1/${prefix}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let jsonRes = await res.json();
    return jsonRes;
  } catch (error) {
    return { statusCode: 501, error };
  }
};

export const apiCall = async ({
  url,
  method = "GET",
  data = null,
  isFile = false,
}) => {
  try {
    let token = localStorage.getItem("drNote_token");
    if (!isTokenValid(token)) {
      localStorage.removeItem("drNote_token");
      useAppStore.setState({
        isLogin: false,
      });
      throw Error("refresh token expired");
    }
    let body = undefined;
    let headers = {
      Authorization: token,
    };

    if (!!data && isFile) {
      var formdata = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formdata.append(key, value);
      });
      body = formdata;
    } else if (!!data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    let res = await fetch(`${URL}/${url}`, {
      method,
      headers,
      body,
    });
    let jsonRes = await res.json();
    return jsonRes;
  } catch (error) {
    throw error;
  }
};
