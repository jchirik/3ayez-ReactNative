
import { AsyncStorage } from 'react-native';

// update in reducer + async storage
export const saveBaskets = (baskets) => {
  AsyncStorage.setItem('WORKING_BASKETS', JSON.stringify(baskets));
  console.log('saveBaskets', baskets);
  return { baskets };
}

const updateBasket = (basket) => {
  const { items_array } = basket;

  let subtotal = 0;
  let basket_quantity = 0;

  // make sure whats returend is always a flost
  items_array.forEach((item) => {
    const quantity = parseFloat(item.quantity) || 0;
    if (item.invalid || quantity <= 0) { return; }

    // use the promotion price if it exists, otherwise regular price
    let unit_price = parseFloat(item.promotion_price) || parseFloat(item.price);
    unit_price = unit_price || 0;
    if (parseFloat(item.incr) && parseFloat(item.incr) > 0) {
      unit_price = unit_price / parseFloat(item.incr);
    }
    subtotal += (unit_price * quantity);

    // update basket quantity
    const increment = parseFloat(item.incr) || 1;
    if (increment === 1) {
      basket_quantity += quantity;
    } else {
      basket_quantity += 1;
    }
  });

  subtotal = parseFloat(subtotal) || 0;
  subtotal = Math.round(subtotal * 1000) / 1000;
  return { ...basket, subtotal, basket_quantity };
}

export const incrementItem = (basket, item, quantity) => {
  let items_array = basket.items_array ? [ ...basket.items_array ] : [];
  // find the item in our basket array + update quantity
  const foundIndex = items_array.findIndex((item_og) => { return item_og.upc === item.upc; });
  if (foundIndex >= 0) {
    const foundItem = items_array[foundIndex];
    let new_quantity = foundItem.quantity + quantity;
    if (item.max_per_basket) {
      new_quantity = Math.min(item.max_per_basket, new_quantity);
    }
    items_array[foundIndex] = { ...foundItem, quantity: new_quantity };
  }
  else {
    items_array.unshift({ ...item, quantity });
  }
  // remove from basket entirely if quantity 0
  items_array = items_array.filter(item => item.quantity > 0);
  return updateBasket({ ...basket, items_array });
}



// addSpecialRequests(baskets[seller_id], p.upc, p.special_requests)
export const addSpecialRequests = (basket, upc, special_requests) => {
  let items_array = basket.items_array ? [ ...basket.items_array ] : [];
  // find the item in our basket array + update quantity
  const foundIndex = items_array.findIndex((item_og) => { return item_og.upc === upc; });
  if (foundIndex >= 0) {
    const foundItem = items_array[foundIndex];
    items_array[foundIndex] = { ...foundItem, ...special_requests };
  }
  return { ...basket, items_array };
}
