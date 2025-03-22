import { render, screen } from "@testing-library/react";

import DesktopMenu from "./desktop-menu";

// EXTEND FOR FLOATING UI TESTS

describe("desktop menu (logged in)", () => {
  const PROFILE_ICON =
    "https://i.scdn.co/image/ab6775700000ee85f8ef77862b055d603565d1c0";

  it("renders correctly", async () => {
    render(<DesktopMenu profileIcon={PROFILE_ICON} />);

    const signInBtn = screen.queryByRole("button", { name: "Sign In" });
    const desktopMenu = screen.getByTitle("Menu");

    expect(signInBtn).not.toBeInTheDocument();
    expect(desktopMenu).toBeInTheDocument();
  });
});

describe("desktop menu (logged out)", () => {
  it("renders correctly", async () => {
    render(<DesktopMenu profileIcon={null} />);

    const desktopMenu = screen.queryByTitle("Menu");
    const signInBtn = screen.getByRole("button", { name: "Sign In" });

    expect(desktopMenu).not.toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
  });
});
