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
import { useEffect, useState } from "react";
import { newUser } from "../api/user";
import CustomAlert from "../components/customAlert";
import { IoMdRefresh } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
export default function CreateUser({ addOpen, handleAddOpen, fetchData }) {
  const [username, setUsername] = useState(generateRandomLetters(5));
  const [password, setPassword] = useState(generateRandomLetters(8));
  const [content, setContent] = useState("");
  const [priceH, setPriceH] = useState(0.06);
  const [priceC, setPriceC] = useState(0.06);
  const [priceM, setPriceM] = useState(0.06);
  const [percent, setPercent] = useState(100);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleCreateUser = async () => {
    if (
      !username ||
      !password ||
      priceH <= 0 ||
      priceC <= 0 ||
      priceM <= 0 ||
      percent <= 0 ||
      percent > 100
    ) {
      showMessage("正确输入所有信息。");
      return;
    }
    setIsLoading(true);
    try {
      await newUser({
        username,
        password,
        content,
        priceH,
        priceC,
        priceM,
        percent,
      });
      handleAddOpen();
      fetchData();
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
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
      <Dialog open={addOpen} handler={handleAddOpen}>
        <DialogHeader>创建用户</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <CustomAlert message={alertMessage} />
          <div className="flex flex-row gap-1 items-center">
            <p className="whitespace-nowrap w-[10%]">用户名</p>
            <Input
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(username);
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
              onClick={() => setUsername(generateRandomLetters(5))}
              className="w-full"
            >
              <IoMdRefresh className="w-full" />
            </IconButton>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="whitespace-nowrap w-[10%]">密码</p>
            <Input
              label="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(password);
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
              onClick={() => setPassword(generateRandomLetters(8))}
              className="w-full"
            >
              <IoMdRefresh />
            </IconButton>
          </div>

          <Input
            label="内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="w-full flex gap-2">
            <Input
              label="短信价格(香港)"
              type="number"
              min={0}
              value={priceH}
              onChange={(e) => setPriceH(e.target.value)}
            />
            <Input
              label="短信价格(中国)"
              type="number"
              min={0}
              value={priceC}
              onChange={(e) => setPriceC(e.target.value)}
            />
            <Input
              label="短信价格(澳门)"
              type="number"
              min={0}
              value={priceM}
              onChange={(e) => setPriceM(e.target.value)}
            />
          </div>
          <Input
            label="短信发送百分比"
            type="number"
            min={0}
            max={100}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleAddOpen}
            className="mr-1"
          >
            <span>取消</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleCreateUser}
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
