import { DB } from "./data.js";

export const USERS = DB;

export const userLogined = USERS.find((user) => Boolean(user.status));

const testIvan = {
  name: "Ivan",
  email: "testivan@gmail.com",
  password: "123",
  favourites: [9, 18, 7],
  orders: [5, 6],
  cart: [9, 18, 7],
  status: false,
};

if (USERS.findIndex((user) => user.email === testIvan.email) < 0) {
  USERS.push(testIvan);
  localStorage.setItem("users", JSON.stringify(USERS));
}

// HEADER
// ======

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const headerUser = document.querySelector(`#headerUser`);
  const headerFavourites = document.querySelector(`#headerFavourites`);
  const headerFavouritesCount = document.querySelector(
    `#headerFavouritesCount`
  );
  const headerShoppingCart = document.querySelector(`#headerShoppingCart`);
  const headerShoppingCartCount = document.querySelector(
    `#headerShoppingCartCount`
  );
  const headerLogout = document.querySelector(`#headerLogout`);

  if (userLogined) {
    headerUser.href = `account.html`;
    headerUser.innerText = userLogined.name;

    headerFavourites.href = `favourites.html`;
    headerFavouritesCount.innerText = userLogined.favourites?.length ?? 0;

    headerShoppingCart.href = `shopping-cart.html`;
    headerShoppingCartCount.innerText = userLogined.cart?.length ?? 0;

    userInfoEmail && (userInfoEmail.innerText = userLogined.email);

    headerLogout.classList.add(`active`);
    headerLogout.addEventListener("click", (e) => {
      e.preventDefault();
      userLogined.status = false;
      localStorage.setItem("users", JSON.stringify(USERS));
      document.location.href = "login.html";
    });
  }
});
