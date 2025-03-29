import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import DesktopMenu from "./desktop-menu";

// EXTEND FOR FLOATING UI TESTS

const waitForPosition = () => act(async () => {});

describe("desktop menu (logged in)", () => {
  const PROFILE_ICON =
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  it("renders correctly", async () => {
    render(<DesktopMenu profileIcon={PROFILE_ICON} username="fake-user" />);

    const signInBtn = screen.queryByRole("link", { name: "Sign In" });
    const desktopMenu = screen.getByAltText("Menu");

    expect(signInBtn).not.toBeInTheDocument();
    expect(desktopMenu).toBeInTheDocument();
  });

  it("menu opens", async () => {
    const user = userEvent.setup();

    render(<DesktopMenu profileIcon={PROFILE_ICON} username="fake-user" />);

    const desktopMenu = screen.getByAltText("Menu");

    await user.click(desktopMenu);

    await waitForPosition();

    const signOutBtn = screen.getByRole("menuitem", { name: "Sign Out" });

    expect(signOutBtn).toBeInTheDocument();
  });
});

describe("desktop menu (logged out)", () => {
  it("renders correctly", async () => {
    render(<DesktopMenu profileIcon={null} username="" />);

    const desktopMenu = screen.queryByAltText("Menu");
    const signInBtn = screen.getByRole("link", { name: "Sign In" });

    expect(desktopMenu).not.toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
  });
});
