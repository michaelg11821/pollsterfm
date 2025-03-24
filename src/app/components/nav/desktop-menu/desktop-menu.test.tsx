import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import DesktopMenu from "./desktop-menu";

// EXTEND FOR FLOATING UI TESTS

const waitForPosition = () => act(async () => {});

describe("desktop menu (logged in)", () => {
  const PROFILE_ICON =
    "https://i.scdn.co/image/ab6775700000ee85f8ef77862b055d603565d1c0";

  it("renders correctly", async () => {
    render(<DesktopMenu profileIcon={PROFILE_ICON} />);

    const signInBtn = screen.queryByRole("link", { name: "Sign In" });
    const desktopMenu = screen.getByAltText("Menu");

    expect(signInBtn).not.toBeInTheDocument();
    expect(desktopMenu).toBeInTheDocument();
  });

  it("menu opens", async () => {
    const user = userEvent.setup();

    render(<DesktopMenu profileIcon={PROFILE_ICON} />);

    const desktopMenu = screen.getByAltText("Menu");

    await user.click(desktopMenu);

    await waitForPosition();

    const signOutBtn = screen.getByRole("menuitem", { name: "Sign Out" });

    expect(signOutBtn).toBeInTheDocument();
  });
});

describe("desktop menu (logged out)", () => {
  it("renders correctly", async () => {
    render(<DesktopMenu profileIcon={null} />);

    const desktopMenu = screen.queryByAltText("Menu");
    const signInBtn = screen.getByRole("link", { name: "Sign In" });

    expect(desktopMenu).not.toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
  });
});
