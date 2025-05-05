import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
} from "@material-tailwind/react";
import { updateUser } from "../api/user";
import CustomAlert from "../components/customAlert";
import { useState, useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";

export default function UpdateUser({
  updateOpen,
  handleUpdateOpen,
  data,
  fetchData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    content: "",
    priceH: 0.06,
    priceC: 0.06,
    priceM: 0.06,
    percent: 100,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "",
        password: data.password || "",
        content: data.content || "",
        priceH: data.priceH || 0.06,
        priceC: data.priceC || 0.06,
        priceM: data.priceM || 0.06,
        percent: data.percent || 100,
      });
    }
  }, [data]);

  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (
      !formData.username ||
      !formData.password ||
      formData.priceH <= 0 ||
      formData.priceC <= 0 ||
      formData.priceM <= 0 ||
      formData.percent <= 0 ||
      formData.percent > 100
    ) {
      showMessage("正确输入所有信息。");
      return;
    }
    try {
      setIsLoading(true);
      await updateUser(data._id, formData);
      setIsLoading(false);
      handleUpdateOpen();
      fetchData();
    } catch (error) {
      setIsLoading(false);
    }
  };
  function generateRandomLetters(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }
  return (
    <div>
      <Dialog open={updateOpen} handler={handleUpdateOpen}>
        <DialogHeader>更新用户</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <CustomAlert message={alertMessage} />
          <div className="flex flex-row gap-1 items-center">
            <p className="whitespace-nowrap w-[10%]">用户名</p>
            <Input
              label="用户名"
              value={formData.username}
              name="username"
              onChange={handleChange}
            />
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formData.username);
                  showMessage("已成功复制到剪贴板。");
                } catch (error) {
                  showMessage("无法复制到剪贴板。");
                }
              }}
              className="w-full"
            >
              <IoCopyOutline className="w-full" />
            </IconButton>
            <IconButton
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  username: generateRandomLetters(5),
                }))
              }
              className="w-full"
            >
              <IoMdRefresh className="w-full" />
            </IconButton>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="whitespace-nowrap w-[10%]">密码</p>
            <Input
              label="密码"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formData.password);
                  showMessage("已成功复制到剪贴板。");
                } catch (error) {
                  showMessage("无法复制到剪贴板。");
                }
              }}
              className="w-full"
            >
              <IoCopyOutline />
            </IconButton>
            <IconButton
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  password: generateRandomLetters(5),
                }))
              }
              className="w-full"
            >
              <IoMdRefresh />
            </IconButton>
          </div>
          <Input
            label="内容"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
          <div className="w-ull flex gap-2">
            <Input
              label="短信价格(香港)"
              name="price"
              min={0}
              value={formData.priceH}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceH: e.target.value,
                }))
              }
            />
            <Input
              label="短信价格(中国)"
              name="price"
              min={0}
              value={formData.priceC}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceC: e.target.value,
                }))
              }
            />
            <Input
              label="短信价格(澳门)"
              name="price"
              min={0}
              value={formData.priceM}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceM: e.target.value,
                }))
              }
            />
          </div>
          <Input
            label="短信发送百分比"
            type="number"
            name="percent"
            min={0}
            max={100}
            value={formData.percent}
            onChange={handleChange}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleUpdateOpen}
            className="mr-1"
          >
            <span>取消</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleUpdateUser}
            disabled={isLoading}
            className="flex flex-row items-center gap-2"
          >
            {isLoading && <Spinner className="h-4" />}
            <span>是</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
