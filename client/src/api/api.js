// src/api/base44Client.js

export const api = {
  auth: {
    async me() {
      // mock user
      return { id: 1, name: "Test User" };
    },
    redirectToLogin(url) {
      window.location.href = "/login?redirect=" + url;
    }
  }
};
