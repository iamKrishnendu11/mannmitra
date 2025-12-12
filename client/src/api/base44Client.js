// src/api/base44Client.js

export const base44 = {
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
