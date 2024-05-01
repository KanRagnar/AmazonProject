import {cart} from '../data/cart.js';
import {products} from '../data/products.js';
import { pastOrders , orderNumber } from '../data/pastOrders.js';


function generateCartItemsHtml(){
  const inCaseOfEmptyCartHTML=
      `<div>
        Your cart is empty
        <a href="amazon.html">go back to store</a>
       </div>`
  let cartHTML = '';
  let cartQuantityDisplay=0;
  let cartItemIndex = 0;
  cart.forEach( (item) => {
    const cartProduct = products.find(product => product.id === item.productName);
    cartQuantityDisplay++;

    cartHTML+= `
        <div class="cart-item-container">
          <div class="delivery-date">
            Delivery date: Tuesday, June 21
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${cartProduct.image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${cartProduct.name}
              </div>
              <div class="product-price">
                $${(cartProduct.priceCents/100).toFixed(2)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label" 
                      data-item-index=${cartItemIndex}
                  >${item.quantity}</span>
                </span>
                <span id="input-container-${cartItemIndex}"></span>
                <span class="update-quantity-link link-primary js-cart-update-button"
                data-product-index=${cartItemIndex} data-is-updating=false>
                  Update
                </span>
                <span class="delete-quantity-link link-primary js-cart-delete-button"
                data-product-index="${cartItemIndex}">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              <div class="delivery-option">
                <input type="radio" 
                  class="delivery-option-input" checked
                  name="delivery-option-${cartItemIndex}"
                  value=0>
                <div>
                  <div class="delivery-option-date">
                    Tuesday, June 21
                  </div>
                  <div class="delivery-option-price">
                    FREE Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio" 
                  class="delivery-option-input"
                  name="delivery-option-${cartItemIndex}"
                  value=499>
                <div>
                  <div class="delivery-option-date">
                    Wednesday, June 15
                  </div>
                  <div class="delivery-option-price">
                    $4.99 - Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio"
                  class="delivery-option-input"
                  name="delivery-option-${cartItemIndex}"
                  value=999>
                <div>
                  <div class="delivery-option-date">
                    Monday, June 13
                  </div>
                  <div class="delivery-option-price">
                    $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    cartItemIndex++;
  })

  
  document.querySelector('.js-cart-quantity-display')
    .innerHTML=`${cartQuantityDisplay} items`;


  document.querySelector('.order-summary').innerHTML= cartHTML ? cartHTML : inCaseOfEmptyCartHTML;

  makeDeleteButtons();
  makeUpdateButtons();

  document.querySelectorAll('.delivery-option-input').forEach(input=>{
    input.addEventListener('change', ()=>{
      generatePaymentSummaryHTML();
    })
  })
}

function findCartsTotalItemPrice(cart){
  let itemsPriceCents=0;
  cart.forEach(item =>{
    const cartProduct = products.find(product => product.id === item.productName);
    itemsPriceCents += parseInt(cartProduct.priceCents* item.quantity);
  })
  return itemsPriceCents;
}

function calTotalShippingCost(cart){
  let shippingCostCents=0;
  for(let i=0 ; i<cart.length ; i++){
    const selectedOption = 
    document.querySelector(`input[name="delivery-option-${i}"]:checked`);
    shippingCostCents += parseInt(selectedOption.value);
    
  }
  shippingCostCents= parseInt(shippingCostCents);
  return shippingCostCents;
}

function calTotalOfAnOrder(cart){
  const itemsPriceCents=findCartsTotalItemPrice(cart);
  const shippingCostCents=calTotalShippingCost(cart);
  return ((itemsPriceCents*11+ shippingCostCents*11)/1000).toFixed(2);
}

function generatePaymentSummaryHTML(){
  let itemsPriceCents=findCartsTotalItemPrice(cart);
  let shippingCostCents=calTotalShippingCost(cart);

  let paymentSummaryHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cart.length}):</div>
            <div class="payment-summary-money">$${itemsPriceCents /100}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${shippingCostCents/100}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(itemsPriceCents + shippingCostCents)/100}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${((itemsPriceCents + shippingCostCents)/1000).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${((itemsPriceCents*11+ shippingCostCents*11)/1000).toFixed(2)}</div>
          </div>

          <div>
            <button class="place-order-button button-primary">
             Place your order
            </button>
            <div class="order-confirmation">Your order has been placed</div>
           </div>
  `
  
  document.querySelector(('.js-payment-summary')).innerHTML= paymentSummaryHTML;


  makePlaceOrderButton();
}

generateCartItemsHtml();
generatePaymentSummaryHTML();


function makePlaceOrderButton(){
  const placeOrderButton=document.querySelector('.place-order-button');
  placeOrderButton.addEventListener('click', ()=>{
    const currentDate= new Date();
    const month= currentDate.getMonth();
    const dayOfTheMonth= currentDate.getDate();
    const order= [];
    let totalOrderCost=calTotalOfAnOrder(cart);
    cart.forEach(item =>{      
      order.push({ 
        productId: item.productName ,
        quantity: item.quantity});
    })
    pastOrders.unshift({order, totalOrderCost , month , dayOfTheMonth });
    localStorage.setItem('pastOrders' , JSON.stringify(pastOrders));
    let nextOrderNumber= orderNumber +1;
    localStorage.setItem('storedOrdersNumber', JSON.stringify(nextOrderNumber));
    
    
    cart.splice(0, cart.length);
    localStorage.setItem('cart', JSON.stringify(cart));
    orderPlacedVerification()
  })
}

function deleteItem(itemIndex){
  cart.splice(itemIndex , 1);
  generateCartItemsHtml();
  generatePaymentSummaryHTML();
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateItem(itemIndex){
  document.querySelectorAll('.js-cart-update-button').forEach((span) =>{
    if(span.dataset.productIndex === itemIndex){
      const inputContainer=document.getElementById(`input-container-${itemIndex}`);
      if(span.dataset.isUpdating === 'false'){
       inputContainer.innerHTML =`<input type="number" class="update-input" min="1" id="input-${itemIndex}">`;
       span.dataset.isUpdating= 'true';
      }else{
       const myInput=document.getElementById(`input-${itemIndex}`);
       const value= myInput.value;
       if(value > 0)
        cart[itemIndex].quantity=parseInt(value);
       document.querySelectorAll('.quantity-label').forEach(label =>{
        if(label.dataset.itemIndex===itemIndex){
          if(value > 0)
            label.innerHTML= value;
          inputContainer.innerHTML =``;
          span.dataset.isUpdating= 'false';
        }
       })
       generatePaymentSummaryHTML();
       localStorage.setItem('cart', JSON.stringify(cart));
    }}
  }) 
}

function makeDeleteButtons(){
  document.querySelectorAll('.js-cart-delete-button')
    .forEach(button =>{
      button.addEventListener('click', ()=>{
        deleteItem(button.dataset.productIndex);
      })
    })
  }

function makeUpdateButtons(){
  document.querySelectorAll('.js-cart-update-button')
    .forEach(button =>{
      button.addEventListener('click', ()=>{
        updateItem(button.dataset.productIndex);
      })
  })
}

function orderPlacedVerification(){
  const confirmation=document.querySelector('.order-confirmation');
  confirmation.classList.add("order-confirmation-shown");
  setTimeout(() =>{
    confirmation.classList.remove("order-confirmation-shown")
  },3000)
}