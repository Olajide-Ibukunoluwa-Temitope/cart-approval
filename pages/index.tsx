import React, { useEffect, useState, } from "react";
import CartItem from "@/components/CartItem/CartItem.comp";
import Frame from "@/components/Frame/Frame.comp";
import useSWR from 'swr';
import { CartContext } from "context/cartContext";
import _ from 'lodash';
import { getAllCarts, getSpecificItem } from "utils";

const isBrowserLoaded = typeof window !== 'undefined';
// const fetcher = (url: string) => fetch(url).then(res => res.json())

const CartPage = (): JSX.Element => {
  const [cartState, setCartState] = useState<Array<Record<string, any>>>([]);
  const [activeCart, setActiveCart] = useState<number>(0);
  const [acceptedItems, setAcceptedItems] = useState<Array<Record<string, any>>>([]);
  const [rejectedItems, setRejectedItems] = useState<Array<Record<string, any>>>([]);

  const handleSelectCart = (event: React.FormEvent<HTMLSelectElement>) => {
    setActiveCart(Number(event.currentTarget.value))
  }

  const j = _.map(acceptedItems, 'total')
  const g = _.reduce(j, function(sum, n) {
    return sum + n;
  }, 0);

  const handleAcceptItem = (id: number) => {
    console.log(activeCart)
    console.log('cartState[activeCart]?.products =>', cartState[0]?.products);
    // let d = [];
    const allProducts = getAllCarts(cartState)
    const selectedProject = _.find(allProducts, ['id', id]);
    const filteredArray = rejectedItems.filter((value) => value.id !== id)
    
    console.log('g ===>>', g)
    console.log('acceptedfilteredArray --->>>', filteredArray)
    setAcceptedItems((prevState) => {
      return [
        ...prevState,
        selectedProject
      ]
    });

    setRejectedItems((prevState) => {
      return [
        // ...prevState,
        ...filteredArray
      ]
    });
  }

  const handleRejectItem = (id: number) => {
    console.log(activeCart)
    console.log('cartState[activeCart]?.products =>', cartState[0]?.products);
    // let d = [];
    const allProducts = getAllCarts(cartState)
    const selectedProject = _.find(allProducts, ['id', id]);
    const filteredArray = acceptedItems.filter((value) => value.id !== id)
    console.log('rejectedfilteredArray --->>>', filteredArray)
    setRejectedItems((prevState) => {
      return [
        ...prevState,
        selectedProject
      ]
    });

    setAcceptedItems((prevState) => {
      return [
        // ...prevState,
        ...filteredArray
      ]
    });
  }


  const displayCorrectCart = (value:number) => {
    switch (value) {
      case cartState.length:
        const carts = getAllCarts(cartState);
        console.log('carts==>', carts)
        return carts.map((
          {title, price, quantity, total, id}: {title: string, price: number, quantity: number, total:number, id: number}, 
          idx: number
        ) => (
              <CartItem 
                key={idx} 
                title={title} 
                price={total} 
                quantity={quantity} 
                id={id}
                index={idx}
              />
            ));
    
      default:
        // console.log('cartState[activeCart]?.userId =>', cartState[activeCart]?.userId)
        const childCart = cartState[activeCart]?.products.map((
          {title, price, quantity, total, id}: {title: string, price: number, quantity: number, total:number, id: number}, 
          idx: number
        ) => (
          <CartItem 
            key={id} 
            title={title} 
            price={total} 
            quantity={quantity} 
            id={id}
            index={idx}
            userId={cartState[activeCart]?.userId}
          />
        ));
        return childCart;
    }
  }
  // console.log('displayCorrectCart ==>', displayCorrectCart(activeCart));
  console.log('acceptedItems ==>', acceptedItems);
  console.log('rejectedItems ==>', rejectedItems);

  

  useEffect(() => {
    const carts = sessionStorage.getItem('cartState');
    const parsedData = carts === null ? null :  JSON.parse(carts);
    console.log('parsedData ==>>>', parsedData);

    if (parsedData !== null) {
      setCartState(parsedData);
      setActiveCart(parsedData.length);
    } else {
      fetch('https://dummyjson.com/carts?limit=5')
        .then(res => res.json())
        .then(data => {
          sessionStorage.setItem('cartState', JSON.stringify(data.carts))
          setCartState(data.carts);
          setActiveCart(data.carts.length)
          // console.log(data.carts);
        });
    }

  }, [isBrowserLoaded]);
  
  return (
    <CartContext.Provider 
      value={{
        cartState: cartState, 
        acceptedItems: acceptedItems, 
        rejectedItems: rejectedItems,
        func: {
          handleAcceptItem: handleAcceptItem,
          handleRejectItem: handleRejectItem
        }
      }}
    >
      <Frame>
        <div id='main'>
          <div className="flexRowBetween">
            <h2>Droppe Xmas &#127876; | Cart</h2>
            <h2>Total: ${g}</h2>
          </div>
          <div>
            <label htmlFor="cart">Select Cart:</label>

            <select name="cart" id="cart" onChange={handleSelectCart}>
              
              {cartState.map((value, idx: number) => (
                <option key={idx} value={idx}>Child {idx + 1}</option>
              ))}
              <option value={cartState.length}>All</option>
            </select>
            <input type="range" min="1" max="100" className="slider" id="myRange" />
          </div>
          <div className="itemSection">
            <div className="flexRowBetween titles">
              <div className="title">
                <span>Product Name</span>
              </div>
              <div className="title">
                <span>Quantity</span>
              </div>
              <div className="title">
                <span>Price</span>
              </div>
              <div className="title">
                <span>Accept/Reject</span>
              </div>
            </div>
            <div id='itemsContainer'>
              {displayCorrectCart(activeCart)}
            </div>
          </div>
        </div>
      </Frame>
    </CartContext.Provider>
    
    
  )
};

export default CartPage;

