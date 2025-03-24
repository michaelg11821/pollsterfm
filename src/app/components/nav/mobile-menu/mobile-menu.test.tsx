import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import MobileMenu from "./mobile-menu";

describe("mobile menu (logged in)", () => {
  const PROFILE_ICON =
    "https://i.scdn.co/image/ab6775700000ee85f8ef77862b055d603565d1c0";

  it("opens when toggle clicked", async () => {
    const user = userEvent.setup();

    render(<MobileMenu profileIcon={PROFILE_ICON} />);

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

    render(<MobileMenu profileIcon={null} />);

    const menuToggle = screen.getByTitle("Toggle menu");

    await user.click(menuToggle);

    const signOutBtn = screen.queryByRole("button", { name: "Sign Out" });
    const signInBtn = screen.getByRole("button", { name: "Sign In" });

    expect(signOutBtn).not.toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
  });
});
