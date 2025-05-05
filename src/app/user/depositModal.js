import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Spinner,
} from "@material-tailwind/react";
import { deposit } from "../api/user";
import CustomAlert from "../components/customAlert";
import { useState, useEffect } from "react";

export default function DepositUser({
  depositOpen,
  handleDepositOpen,
  data,
  fetchData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [usdt, setUSDT] = useState(0);

  useEffect(() => {
    setUSDT(0);
  }, []);

  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleDepositUser = async () => {
    if (usdt == 0) {
      showMessage("充值USDT不能为0");
      return;
    }
    try {
      setIsLoading(true);
      await deposit(data._id, usdt);
      setIsLoading(false);
      setUSDT(0);
      handleDepositOpen();
      fetchData();
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={depositOpen} handler={handleDepositOpen}>
        <DialogHeader>充值USDT</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <CustomAlert message={alertMessage} />
          <Input
            label="短信发送百分比"
            type="number"
            min={0}
            value={usdt}
            onChange={(e) => setUSDT(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleDepositOpen}
            className="mr-1"
          >
            <span>取消</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleDepositUser}
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
