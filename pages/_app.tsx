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
  
  const totalAcceptedPrice = _.reduce(allTotalAcceptedPricesArray, function(sum, n) {
    return sum + n;
  }, 0);

  const handleAcceptItem = (item: Record<string, any>) => {
    const selectedProject = _.find(allProductsArray, item);
    const filteredArray = rejectedItems.filter((value) => value !== item)
    
    setAcceptedItems((prevState) => {
      sessionStorage.setItem('acceptedItems', JSON.stringify([...acceptedItems, selectedProject]))
      return [
        ...prevState,
        selectedProject
      ]
    });

    setRejectedItems((prevState) => {
      sessionStorage.setItem('rejectedItems', JSON.stringify([...filteredArray]))
      return [
        ...filteredArray
      ]
    });
  }

  const handleRejectItem = (item: Record<string, any>) => {
    const selectedProject = _.find(allProductsArray, item);
    const filteredArray = acceptedItems.filter((value) => value !== item)
   
    setRejectedItems((prevState) => {
      sessionStorage.setItem('rejectedItems', JSON.stringify([...rejectedItems, selectedProject]))
      return [
        ...prevState,
        selectedProject
      ]
    });

    setAcceptedItems((prevState) => {
      sessionStorage.setItem('acceptedItems', JSON.stringify([...filteredArray]))
      return [
        ...filteredArray
      ]
    });
  }

  return (
    <CartContext.Provider 
      value={{
        cartState: cartState, 
        acceptedItems: acceptedItems, 
        rejectedItems: rejectedItems,
        totalWithOutDiscount: totalAcceptedPrice,
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
