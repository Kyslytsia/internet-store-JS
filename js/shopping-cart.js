import { PRODUCTS } from "./data.js";
import { USERS, userLogined } from "./script.js";

const cartTable = document.querySelector(`#cartTable`)?.children[2];

function renderCart(user) {
  let totalSum = [];

  user.cart.forEach((el) => {
    const productInCart = PRODUCTS.find((product) => product.id === el);

    const price = productInCart.sale
      ? productInCart.price -
        (productInCart.price * productInCart.salePercent) / 100
      : productInCart.price;

    totalSum.push(price);

    const tr = document.createElement("tr");
    tr.innerHTML = `<tr><td>
                          <div class="item__info">
                              <img src="images/products/${productInCart.img}.png"
                               alt="${productInCart.title}" height="100">
                              <div>
                                  <p class="item__info--title">${productInCart.title}</p>
                              </div>
                          </div>
                      </td>
                      <td>$${price}</td>
                      <td>
                          <button class="delete-product-in-cart"><img src="images/delete.png" data-product_id="${productInCart.id}" alt="favourite" height="20" "></button>
                      </td> </tr>`;

    cartTable.appendChild(tr);

    const totalPrice = document.querySelector(`.totalPrice`);
    totalPrice.innerText =
      `итого: ` + ` $ ` + totalSum.reduce((acc, price) => (acc += price), 0);
  });

  if (user.cart.length === 0) {
    document.querySelector(`.buy-block`).innerHTML = "";
  }

  const deleteProductInCart = document.querySelectorAll(
    ".delete-product-in-cart"
  );

  deleteProductInCart.forEach((button) => {
    button.addEventListener("click", (e) => {
      const product_id = parseInt(e.target.dataset.product_id);

      const index = userLogined.cart.findIndex((value) => value === product_id);

      userLogined.cart.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(USERS));
      document.querySelector(`#headerShoppingCartCount`).innerText =
        userLogined.cart?.length ?? 0;

      cartTable.innerHTML = "";
      renderCart(user);
    });
  });
}

if (userLogined) {
  renderCart(userLogined);
}

const btn = document.querySelector(`.buy-block__btn`);

btn.addEventListener("click", () => {
  userLogined.orders.push(
    ...userLogined.cart.map((el) => {
      return el;
    })
  );
  userLogined.cart = [];
  localStorage.setItem("users", JSON.stringify(USERS));
  document.querySelector(`#headerShoppingCartCount`).innerText =
    userLogined.cart?.length ?? 0;
  document.querySelector(`.buy-block`).innerHTML = "";
  cartTable.innerHTML = "";
  document.querySelector(`.successful-buy`).style.display = "block";
});
