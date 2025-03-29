import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import MobileMenu from "./mobile-menu";

describe("mobile menu (logged in)", () => {
  const PROFILE_ICON =
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  it("opens when toggle clicked", async () => {
    const user = userEvent.setup();

    render(<MobileMenu profileIcon={PROFILE_ICON} username="fake-user" />);

    const menuToggle = screen.getByTitle("Toggle menu");

    await user.click(menuToggle);

    const signInBtn = screen.queryByRole("button", { name: "Sign In" });
    const signOutBtn = screen.getByRole("button", { name: "Sign Out" });

    expect(signInBtn).not.toBeInTheDocument();
    expect(signOutBtn).toBeInTheDocument();
  });
});

describe("mobile menu (logged out)", () => {
  it("opens when toggle clicked", async () => {
    const user = userEvent.setup();

    render(<MobileMenu profileIcon={null} username="" />);

    const menuToggle = screen.getByTitle("Toggle menu");

    await user.click(menuToggle);

    const signOutBtn = screen.queryByRole("button", { name: "Sign Out" });
    const signInBtn = screen.getByRole("button", { name: "Sign In" });

    expect(signOutBtn).not.toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
  });
});
