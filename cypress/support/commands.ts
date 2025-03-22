Cypress.Commands.add("loginWithSpotify", () => {
  cy.session("spotifySession", () => {
    cy.visit("/sign-in");
    cy.contains("Sign in with Spotify").click();

    cy.origin("https://accounts.spotify.com", () => {
      cy.get("input[name='username']").type(Cypress.env("SPOTIFY_EMAIL"), {
        log: false,
      });

      cy.get("input[name='password']").type(Cypress.env("SPOTIFY_PASSWORD"), {
        log: false,
      });

      cy.get("button[type='submit']").click();
    });

    cy.url().should("include", "/profile");

    cy.getCookie("next-auth.session-token").then((cookie) => {
      if (cookie) {
        cy.setCookie("next-auth.session-token", cookie.value);
      }
    });
  });
});

describe("Authenticated Tests", () => {
  before(() => {
    cy.loginWithSpotify();
  });

  it("should access a protected page", () => {
    cy.visit("/profile");
    cy.contains("OAUTH_TEST");
  });
});
