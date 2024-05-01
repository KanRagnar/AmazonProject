const storedPastOrders = localStorage.getItem('pastOrders');
let storedOrdersNumber = localStorage.getItem('storedOrdersNumber');

// localStorage.removeItem('pastOrders');
// localStorage.removeItem('storedOrdersNumber');


export let orderNumber = storedOrdersNumber ? JSON.parse(storedOrdersNumber) : 0;
export const pastOrders= storedPastOrders ? JSON.parse(storedPastOrders) : [];