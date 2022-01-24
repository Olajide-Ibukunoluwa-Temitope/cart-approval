import React, { useEffect, useState, useMemo } from "react";
import CartItem from "@/components/CartItem/CartItem.comp";
import Frame from "@/components/Frame/Frame.comp";
import useSWR from 'swr';
import { CartContext } from "context/cartContext";

const isBrowserLoaded = typeof window !== 'undefined';
const fetcher = (url: string) => fetch(url).then(res => res.json())

const CartPage = (): JSX.Element => {
  const [cartState, setCartState] = useState<any>([]);

  useEffect(() => {
    const carts = sessionStorage.getItem('cartState') || null;
    const parsedData = carts === null ? null :  JSON.parse(carts);
    console.log('parsedData ==>>>', parsedData);

    if (parsedData !== null) {
      setCartState(parsedData);
    } else {
      fetch('https://dummyjson.com/carts?limit=5')
        .then(res => res.json())
        .then(data => {
          sessionStorage.setItem('cartState', JSON.stringify(data.carts))
          setCartState(data.carts);
          console.log(data.carts);
        });
    }

  }, [isBrowserLoaded]);
  // console.log('data =>', data);
  // if (error) return <div>failed to load</div>
  // if (!data) return <div>loading...</div>
  
  return (
    <CartContext.Provider value={{cartState: cartState}}>
      <Frame>
        <div id='main'>
          <div className="flexRowBetween">
            <h2>Droppe Xmas &#127876; | Cart</h2>
            <h2>Total: $0</h2>
          </div>
          <div>
            <label htmlFor="cars">Choose a car:</label>

            <select name="cars" id="cars">
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
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
              {
                cartState[0]?.products.map(({title, price, quantity, id}: {title: string, price: number, quantity: number, id: number}) => (
                  <CartItem key={id} title={title} price={price} quantity={quantity} />
                ))
              }
            </div>
          </div>
        </div>
      </Frame>
    </CartContext.Provider>
    
    
  )
};

export default CartPage;

