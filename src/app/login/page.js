"use client";

import { Button, Card, Typography, Input } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validationSignIn } from "./helper";
import CustomAlert from "../components/customAlert";
import { signin } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleSignin = async () => {
    let checkValid = validationSignIn(username, password);
    if (!checkValid.result) {
      showMessage(checkValid.message);
      return;
    }
    try {
      setIsLoading(true);
      let result = await signin(username, password);
      if (result.success) {
        let token = result.token;
        let user = result.user;
        dispatch(login({ token, user }));
        setTimeout(() => router.push("/main"), 2000);
      } else {
        showMessage("用户名或密码错误");
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      router.push("/main");
    }
  }, []);

  return (
    <div className="flex flex-row bg-gray-600 w-full h-screen">
      <div className="w-1/2 bg-amber-600 flex items-center justify-center ">
        <img src="/gold_logo.png" className="w-full" />
      </div>
      <div className="content  w-1/2">
        <CustomAlert message={alertMessage} />
        <div className="h-screen flex items-center justify-center">
          <Card
            shadow={false}
            color="transparent"
            className="text-gray-500"
          >
            <div>
              <div className="flex items-self-center justify-self-center">
                <Typography className="font-medium items-self-center text-4xl">
                  登陆(管理面板)
                </Typography>
              </div>
              <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                  <Input
                    size="lg"
                    label="用户名"
                    color="white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <Input
                    type="password"
                    size="lg"
                    label="密码"
                    color="white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  fullWidth
                  type="submit"
                  onSubmit={handleSignin}
                  loading={isLoading}
                  onClick={handleSignin}
                  className="mt-6 flex justify-center"
                >
                  登陆
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
