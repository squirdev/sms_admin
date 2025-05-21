import { Button, Card, List, ListItem } from "@material-tailwind/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { useRouter } from "next/navigation";

const Header = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  return (
    <div className="h-full">
      {isAuth ? (
        <Card className="w-full h-screen">
          <Link href="#">
            <img src="/logo.png" className="w-[200px] p-5" />
          </Link>
          <div className="w-full flex flex-col h-screen justify-between">
            <List className="text-gray-900 text-xl font-bold w-full">
              <Link href="/main">
                <ListItem>仪表板</ListItem>
              </Link>
              <Link href="/user">
                <ListItem>用户管理</ListItem>
              </Link>
              <Link href="/payment">
                <ListItem>付款日志</ListItem>
              </Link>
              <Link href="/sms">
                <ListItem>短信日志</ListItem>
              </Link>
            </List>
            <div className="justify-center flex">
              <Button
                className="mb-4 bg-gray-700 text-white text-xl w-[80%]"
                onClick={handleLogout}
              >
                登出
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Header;
