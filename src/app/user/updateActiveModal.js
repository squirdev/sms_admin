import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
} from "@material-tailwind/react";
import { updateUser } from "../api/user";
import { useState } from "react";
import CustomAlert from "../components/customAlert";

export default function UpdateActiveUser({
  updateActiveOpen,
  handleUpdateActiveOpen,
  fetchData,
  data,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };
  const handleUpdateActiveUser = async () => {
    setIsLoading(true);
    try {
      await updateUser(data._id, { status: !data.status });
      setIsLoading(false);
      handleUpdateActiveOpen();
      fetchData();
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Dialog open={updateActiveOpen} handler={handleUpdateActiveOpen}>
        <DialogHeader>更新用户</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <p className="text-black font-medium text-lg">
            您确实要更改此用户的活动状态吗？
          </p>
          <CustomAlert message={alertMessage} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleUpdateActiveOpen}
            className="mr-1"
          >
            <span>取消</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleUpdateActiveUser}
            className="flex flex-row items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Spinner className="h-4" />}是
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
