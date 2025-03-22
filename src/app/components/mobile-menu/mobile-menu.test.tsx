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

    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});

describe("mobile menu (logged out)", () => {
  it("opens when toggle clicked", async () => {
    const user = userEvent.setup();

    render(<MobileMenu profileIcon={null} />);

    const menuToggle = screen.getByTitle("Toggle menu");

    await user.click(menuToggle);

    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign In")).toBeInTheDocument();
  });
});
