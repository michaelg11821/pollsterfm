import userEvent from "@testing-library/user-event";

import { profilePath } from "./config";

import { render, screen, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";

import TestToastWrapper from "@/lib/__tests__/utils/test-toast-wrapper";
import { verifyTurnstile } from "@/lib/actions";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import ProviderLogins from "./provider-logins";

vi.mock("../../../lib/actions", () => ({
  __esModule: true,
  verifyTurnstile: vi.fn(
    (token) =>
      new Promise((resolve) =>
        setTimeout(() => {
          if (token === "valid-mock-token") {
            resolve({ success: true, status: 200 });
          }
        }, 100),
      ),
  ),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn((provider, options) => {
    Promise.resolve({
      error: null,
      status: 200,
      ok: true,
      url: options?.profilePath || profilePath,
    });
  }),
}));

type MockTurnstileProps = {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
};

vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: MockTurnstileProps) => {
    const token = "valid-mock-token";

    return <div data-testid="turnstile" onClick={() => onSuccess(token)} />;
  },
}));

vi.mock(import("next/navigation"), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useSearchParams: vi.fn(() => new ReadonlyURLSearchParams()),
  };
});

describe("ProviderLogins", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signIn after successful Turnstile verification", async () => {
    const user = userEvent.setup();

    render(<ProviderLogins />, { wrapper: TestToastWrapper });

    const turnstile = screen.getByTestId("turnstile");

    await user.click(turnstile);

    await waitFor(() => {
      expect(screen.getByText("Sign in with Spotify")).not.toBeDisabled();
    });

    const spotifySignIn = screen.getByText("Sign in with Spotify");

    await user.click(spotifySignIn);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("spotify", {
        redirectTo: profilePath,
      });
    });
  });

  it("shows loading state during verification", async () => {
    const user = userEvent.setup();

    render(<ProviderLogins />, { wrapper: TestToastWrapper });

    const turnstile = screen.getByTestId("turnstile");

    await user.click(turnstile);

    await waitFor(async () => {
      const spotifySignIn = screen.getByText("Sign in with Spotify");

      await user.click(spotifySignIn);

      expect(screen.getByText("Please wait...")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.queryByText("Please wait...")).not.toBeInTheDocument();
      },
      { timeout: 200 },
    );
  });

  it("redirectTo after successful sign in", async () => {
    const mockedUseSearchParams = vi.mocked(useSearchParams);
    mockedUseSearchParams.mockReturnValue(
      new ReadonlyURLSearchParams({
        redirectTo: encodeURIComponent("/settings"),
      }),
    );

    const user = userEvent.setup();

    render(<ProviderLogins />, { wrapper: TestToastWrapper });

    const turnstile = screen.getByTestId("turnstile");

    await user.click(turnstile);

    await waitFor(() => {
      expect(screen.getByText("Sign in with Spotify")).not.toBeDisabled();
    });

    const spotifySignIn = screen.getByText("Sign in with Spotify");

    await user.click(spotifySignIn);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("spotify", {
        redirectTo: "/settings",
      });
    });
  });
});

describe("ProviderLogins errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sign in without turnstile token fails", async () => {
    const user = userEvent.setup();

    render(<ProviderLogins />, { wrapper: TestToastWrapper });

    const spotifySignIn = screen.getByRole("button", {
      name: "Sign in with Spotify",
    });

    expect(spotifySignIn).toBeDisabled();
    spotifySignIn.removeAttribute("disabled");

    await user.click(spotifySignIn);

    expect(
      screen.queryByText("Please complete the verification."),
    ).not.toBeInTheDocument();
  });

  it("shows error when Turnstile verification fails", async () => {
    const mockedVerify = vi.mocked(verifyTurnstile);
    mockedVerify.mockResolvedValueOnce({
      success: false,
      error: ["invalid-token"],
      status: 401,
    });

    const user = userEvent.setup();

    render(<ProviderLogins />, { wrapper: TestToastWrapper });

    const turnstile = screen.getByTestId("turnstile");
    await user.click(turnstile);

    await waitFor(() => {
      const spotifySignIn = screen.getByRole("button", {
        name: "Sign in with Spotify",
      });

      expect(spotifySignIn).not.toBeDisabled();
    });

    const spotifySignIn = screen.getByRole("button", {
      name: "Sign in with Spotify",
    });
    await user.click(spotifySignIn);

    await waitFor(() => {
      expect(
        screen.getByText("Verification failed. Please try again."),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Please wait...")).not.toBeInTheDocument();
  });
});
