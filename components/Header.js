import React from "react";
import { Menu } from "semantic-ui-react";
import { useRouter } from "next/router";

const Header = (props) => {
  const router = useRouter();
  return (
    <Menu>
      <Menu.Item onClick={() => router.push("/")}>CrowdCoin</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item onClick={() => router.push("/")}>Campaigns</Menu.Item>
        <Menu.Item onClick={() => router.push("campaigns/new")}>+</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
