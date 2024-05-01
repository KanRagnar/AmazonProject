import { cart } from '../data/cart.js';
import { pastOrders } from '../data/pastOrders.js';
import { products } from '../data/products.js';


function updateNumberOfItemsInCart(){
  let cartQuantity = 0;

  cart.forEach((item) =>{
    cartQuantity += parseInt(item.quantity);
  })
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
};

function generatePastOrdersHTML(){
  let pastOrdersHTML='';
  pastOrders.forEach(order =>{
    let detailsHTML=``;
    order.order.forEach(item =>{
      const cartProduct = products.find(product => product.id === item.productId);
      const productIMG = cartProduct.image;
      const productName = cartProduct.name;
      detailsHTML+= `
      <div class="product-image-container">
        <img src="${productIMG}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${productName}
        </div>
        <div class="product-delivery-date">
          Arriving on: August 15
        </div>
        <div class="product-quantity">
          Quantity : ${item.quantity}
        </div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>`
    })
    let orderHeader=`
          <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.dayOfTheMonth}/${order.month + 1}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${order.totalOrderCost}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>27cba69d-4c3d-4098-b42d-ac7fa62b7664</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${detailsHTML}
        </div>`;
    pastOrdersHTML+=orderHeader;
  })
  const ordersGrid = document.querySelector('.js-orders-grid')
  ordersGrid.innerHTML=pastOrdersHTML;
  pastOrders.forEach(order =>{
    const orderDetails = document.querySelector('.order-details-grid')
  })


}

updateNumberOfItemsInCart();
generatePastOrdersHTML();
