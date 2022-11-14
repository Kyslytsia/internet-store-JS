import { PRODUCTS } from "./data.js";
import { USERS, userLogined } from "./script.js";

const favouriteTable = document.querySelector("#favouriteTable")?.children[2];

function renderFavourite(user) {
  user.favourites.forEach((favouriteID) => {
    const favouriteProduct = PRODUCTS.find(
      (product) => product.id === favouriteID
    );

    const tr = document.createElement("tr");
    tr.innerHTML = `<tr><td>
                          <div class="item__info">
                              <img src="images/products/${
                                favouriteProduct.img
                              }.png"
                               alt="${favouriteProduct.title}" height="100">
                              <div>
                                  <p class="item__info--title">${
                                    favouriteProduct.title
                                  }</p>
                              </div>
                          </div>
                      </td>
                      <td>$${favouriteProduct.price}</td>
                      <td>${
                        favouriteProduct.sale
                          ? "<span class='item__sale'>- " +
                            favouriteProduct.salePercent +
                            "%" +
                            "</span>"
                          : "-"
                      }
                      </td>
                      <td>$${
                        favouriteProduct.sale
                          ? favouriteProduct.price -
                            (favouriteProduct.price *
                              favouriteProduct.salePercent) /
                              100
                          : favouriteProduct.price
                      }
                      </td>
                      <td>
                          <button class="item__favourite"><img src="images/product__favourite--true.png" alt="favourite" height="20"  data-product_id="${
                            favouriteProduct.id
                          }"></button>
                          <button class="add-product-in-cart"><img src="images/product__shopping-cart.png" data-product_id="${
                            favouriteProduct.id
                          }" alt="favourite" height="20" "></button>
                      </td> </tr>`;

    favouriteTable.appendChild(tr);
  });

  const favouriteButtons = document.querySelectorAll(".item__favourite");

  favouriteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const product_id = parseInt(e.target.dataset.product_id);

      const index = userLogined.favourites.findIndex(
        (value) => value === product_id
      );

      userLogined.favourites.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(USERS));
      document.querySelector(`#headerFavouritesCount`).innerText =
        userLogined.favourites?.length ?? 0;

      favouriteTable.innerHTML = "";
      renderFavourite(user);
    });
  });

  const addProductInCart = document.querySelectorAll(".add-product-in-cart");

  if (userLogined) {
    addProductInCart.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const product_id = e.target.dataset.product_id;

        if (userLogined.cart.includes(parseInt(product_id))) {
          const index = userLogined.cart.findIndex(
            (el) => el === parseInt(product_id)
          );

          userLogined.cart.splice(index, 1);
        } else {
          userLogined.cart.push(parseInt(product_id));
        }

        document.querySelector(`#headerShoppingCartCount`).innerText =
          userLogined.cart?.length ?? 0;

        localStorage.setItem("users", JSON.stringify(USERS));
      });
    });
  }
}

if (userLogined) {
  renderFavourite(userLogined);
}
