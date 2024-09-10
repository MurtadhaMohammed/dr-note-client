import {
  Button,
  Card,
  Divider,
  Input,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { FaArrowRightLong } from "react-icons/fa6";
import OtpInput from "react-otp-input";
import "./login.css";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../../lib/services";

const ArToEn = (numb) => {
  return numb?.replace(/[\u0660-\u0669]/g, (d) => d.charCodeAt() - 1632);
};

const LoginScreen = () => {
  const [otp, setOtp] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async () => {
    setLoading(true);
    const respJson = await auth("login", { phone });
    if (respJson.success)
      navigate(`/login?verify=${phone}&otp=${respJson.shortCode}`, { replace: true });
    else message.error("Login Field!");
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const respJson = await auth("verifyCode", { phone, otp });
    if (respJson.success) {
      localStorage.setItem("drNote_token", respJson.token);
      navigate("/", { replace: true });
    } else message.error("Login Field!");
    setLoading(false);
  };

  const phoneValidate = () => {
    const regex = /^[\u0621-\u064A\u0660-\u0669]+|07[3-9]\d{1,11}$/;
    const result = regex.exec(ArToEn(phone));
    return result && phone.length === 11;
  };

  useEffect(() => {
    if (searchParams.get("otp")) setOtp(searchParams.get("otp"));
  }, [searchParams]);

  return (
    <div className="page login-screen">
      {searchParams.get("verify") ? (
        <Card className="login-card">
          <Space direction="vertical" size={0}>
            <Typography.Title level={2} className="title">
              Verfication.
            </Typography.Title>
            <Typography.Text className="msg" type="secondary">
              You will get a OTP via SMS
            </Typography.Text>
          </Space>
          <Divider />
          <div className="otp">
            <OtpInput
              value={otp}
              onChange={(val) => setOtp(val)}
              numInputs={5}
              placeholder="00000"
              renderSeparator={
                <span style={{ opacity: 0.4, padding: 6 }}>-</span>
              }
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <Button onClick={handleVerify} size="large" type="primary" block>
            <div className="app-flex">
              <Typography.Text style={{ color: "#fff", paddingRight: 6 }}>
                Verify
              </Typography.Text>
              {loading ? (
                <Spin spinning={true} size="small" />
              ) : (
                <FaArrowRightLong />
              )}
            </div>
          </Button>
        </Card>
      ) : (
        <Card className="login-card">
          <Space direction="vertical" size={0}>
            <Typography.Title className="title">Hi.</Typography.Title>
            <Typography.Text className="msg" type="secondary">
              Please enter your phone number.
            </Typography.Text>
          </Space>
          <Divider />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="large"
            placeholder="07xxxxxxxxx"
          />
          <Button
            loading={loading}
            disabled={!phoneValidate()}
            onClick={handleLogin}
            size="large"
            type="primary"
            block
          >
            Send
          </Button>
        </Card>
      )}
    </div>
  );
};

export default LoginScreen;
