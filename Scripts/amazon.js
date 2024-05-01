import {cart} from '../data/cart.js';
import {products} from '../data/products.js';

generateProductsShowingHTML(products);
updateNumberOfItemsInCart();

function updateNumberOfItemsInCart(){
  let cartQuantity = 0;

  cart.forEach((item) =>{
    cartQuantity += parseInt(item.quantity);
  })
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

// generates the products html inside the grid
function generateProductsShowingHTML(productArray){
  let productsHTML = ``;
  productArray.forEach((product) =>{
    productsHTML += `
    <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars*10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${(product.priceCents/100).toFixed(2)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-message" data-product-id= "${product.id}">
          <img src="images/icons/checkmark.png" 
          >
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart-button" 
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-product-grid').innerHTML = productsHTML;
}

function addToCart(productId){
  let matchingItem;

  //checks if we already have the item in the cart
  cart.forEach((item) =>{
    if(productId === item.productName){
        matchingItem = item;
      }
    })


  if(matchingItem){
    matchingItem.quantity= matchingItem.quantity + parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value) ;
    }
  else{
    cart.push({
        productName: productId,
        quantity: parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value)
      });
    }
}

//makes the add to cart button do smt
document.querySelectorAll('.js-add-to-cart-button')
  .forEach((button) =>{
    button.addEventListener('click', ()=>{
      const productId= button.dataset.productId;

      //verification that the product was added to the cart
      document.querySelectorAll('.js-added-to-cart-message')
        .forEach((item) =>{
          if(productId === item.dataset.productId){
            item.classList.add("added-to-cart-shown");
            setTimeout(() =>{
              item.classList.remove("added-to-cart-shown")
            },500)
        }
      });
      
      addToCart(productId);
      localStorage.setItem('cart', JSON.stringify(cart))

      updateNumberOfItemsInCart();

        
    });
  });


const searchButton= document.querySelector('.js-search-button');
const searchInput= document.querySelector('.js-search-input');

searchButton.addEventListener('click', ()=>{
  const searchString= searchInput.value
  const searchResults= products.filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()));
  console.log(searchResults)
  generateProductsShowingHTML(searchResults);
});