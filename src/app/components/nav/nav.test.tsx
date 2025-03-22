import { render, screen } from "@testing-library/react";

import Nav from "./nav";

describe("navbar", () => {
  it("renders correctly", async () => {
    render(<Nav />);

    expect(screen.getByText("Pollster.fm")).toBeInTheDocument();
  });
});
