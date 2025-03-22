import { render, screen } from "@testing-library/react";

import Nav from "./nav";

describe("navbar", () => {
  it("renders correctly", async () => {
    render(<Nav />);

    const header = screen.getByRole("heading", { level: 1 });

    expect(header).toBeInTheDocument();
  });
});
