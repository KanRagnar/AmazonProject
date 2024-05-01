const storedCart= localStorage.getItem('cart');
export const cart = (storedCart ? JSON.parse(storedCart) : []);

