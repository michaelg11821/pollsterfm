export {};

declare global {
  namespace Cypress {
    interface Chainable {
      loginWithSpotify(): Chainable<void>;
    }
  }
}
