import React, { useState } from 'react';
import '@/styles/global.css'
import { CartContext } from '../context/cartContext'
import type { AppProps } from 'next/app'
import { getAllCarts } from 'utils';
import _  from 'lodash';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [cartState, setCartState] = useState<Array<Record<string, any>>>([]);
  const [acceptedItems, setAcceptedItems] = useState<Array<Record<string, any>>>([]);
  const [rejectedItems, setRejectedItems] = useState<Array<Record<string, any>>>([]);

  const allProductsArray = getAllCarts(cartState);
  const allTotalAcceptedPricesArray = _.map(acceptedItems, 'total');
  const allTotalRejectedPricesArray = _.map(rejectedItems, 'total');
  
  const totalAcceptedPrice = _.reduce(allTotalAcceptedPricesArray, function(sum, n) {
    return sum + n;
  }, 0);

  const totalRejectedPrice = _.reduce(allTotalRejectedPricesArray, function(sum, n) {
    return sum + n;
  }, 0);

  const handleAcceptItem = (item: Record<string, any>) => {
    const selectedProduct = _.find(allProductsArray, item);
    console.log('====>>', _.findIndex(rejectedItems, selectedProduct))
    const rejectedItemsCopy = rejectedItems;
    const indexOfItem = _.findIndex(rejectedItems, selectedProduct);
    // const filteredArray = _.uniqWith(rejectedItems.filter((value) => value !== item), _.isEqual)
    if (indexOfItem !== -1) {
      rejectedItemsCopy.splice(indexOfItem, 1)
    }
    // const filteredArray = rejectedItemsCopy.splice(indexOfItem, 1)
    console.log('acceptindexOfItem => ', indexOfItem)
    console.log('accept => ', rejectedItemsCopy)
    const updatedAcceptedState = _.uniqWith([...acceptedItems, selectedProduct], _.isEqual);
    
    setAcceptedItems((prevState) => {
      sessionStorage.setItem('acceptedItems', JSON.stringify(updatedAcceptedState))
      return updatedAcceptedState;
    });

    setRejectedItems((prevState) => {
      sessionStorage.setItem('rejectedItems', JSON.stringify([...rejectedItemsCopy]))
      return [
        ...rejectedItemsCopy
      ]
    });
  }

  const handleRejectItem = (item: Record<string, any>) => {
    const selectedProduct = _.find(allProductsArray, item);
    console.log('====>>', _.findIndex(acceptedItems, selectedProduct))
    const acceptedItemsCopy = acceptedItems;
    const indexOfItem = _.findIndex(acceptedItemsCopy, selectedProduct);
    // const filteredArray = _.uniqWith(acceptedItems.filter((value) => value !== item), _.isEqual);
    if (indexOfItem !== -1) {
      acceptedItemsCopy.splice(indexOfItem, 1)
    }
    
    console.log('rejectindexOfItem => ', indexOfItem)
    console.log('reject =>', acceptedItemsCopy)
    const updatedRejectedState = _.uniqWith([...rejectedItems, selectedProduct], _.isEqual);
   
    setRejectedItems((prevState) => {
      sessionStorage.setItem('rejectedItems', JSON.stringify(updatedRejectedState))
      return updatedRejectedState;
    });

    setAcceptedItems((prevState) => {
      sessionStorage.setItem('acceptedItems', JSON.stringify([...acceptedItemsCopy]))
      return [
        ...acceptedItemsCopy
      ]
    });
  }

  return (
    <CartContext.Provider 
      value={{
        cartState: cartState, 
        acceptedItems: acceptedItems, 
        rejectedItems: rejectedItems,
        totalAcceptedProductCostWithOutDiscount: totalAcceptedPrice,
        totalRejectedProductCost: totalRejectedPrice,
        func: {
          handleAcceptItem: handleAcceptItem,
          handleRejectItem: handleRejectItem,
          setCartState: setCartState,
          setAcceptedItems: setAcceptedItems,
          setRejectedItems: setRejectedItems
        }
      }}
    >
      <Component {...pageProps} />
    </CartContext.Provider>
  )
}
