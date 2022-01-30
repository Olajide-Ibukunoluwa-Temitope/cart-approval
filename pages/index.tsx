import React, { useEffect, useState, } from "react";
import CartItem from "@/components/CartItem/CartItem.comp";
import Frame from "@/components/Frame/Frame.comp";
import { CartContext } from "../context/cartContext";
import _ from 'lodash';
import { getAllCarts } from "../utils";
import Router from "next/router";
import ProductTable from "@/components/ProductTable/ProductTable.comp";
import CartController from "../controller/cart.controller";

const isBrowserLoaded = typeof window !== 'undefined';

const CartPage = (): JSX.Element => {
  const {cartState, totalAcceptedProductCostWithOutDiscount, func, acceptedItems, rejectedItems} = React.useContext(CartContext);
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeCart, setActiveCart] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<number>(0);

  const allProductsArray = getAllCarts(cartState)
  const totalPrices = _.map(allProductsArray, 'total');
  const max = Math.max(...totalPrices);
  const min = Math.min(...totalPrices);

  const handleSelectCart = (event: React.FormEvent<HTMLSelectElement>) => {
    setActiveCart(Number(event.currentTarget.value));
  };

  const handleChangeFilter = (event: React.FormEvent<HTMLInputElement>) => {
    setFilterValue(Number(event.currentTarget.value));
  };

  const handleAcceptAllItems = () => {
    const acceptedProducts = _.uniqWith(allProductsArray, _.isEqual);

    func.setAcceptedItems(() => {
      sessionStorage.setItem('acceptedItems', JSON.stringify([...acceptedProducts]))
      return [
        ...acceptedProducts,
      ]
    });

    func.setRejectedItems(() => {
      sessionStorage.setItem('rejectedItems', JSON.stringify([]))
      return []
    });

  };

  const handleRejectAllItems = () => {
    const rejectedProducts = _.uniqWith(allProductsArray, _.isEqual);

    func.setRejectedItems(() => {
      sessionStorage.setItem('rejectedItems', JSON.stringify([...rejectedProducts]))
      return [
        ...rejectedProducts,
      ]
    });
    func.setAcceptedItems(() => {
      sessionStorage.setItem('acceptedItems', JSON.stringify([]))
      return []
    });

  }

  const handleContinue = async () => {
    const rejectedAndAcceptedArray = [...rejectedItems, ...acceptedItems];
    const lengthOfRejectedAndAcceptedArray = rejectedAndAcceptedArray.length;
    const lengthOfAllProducts = allProductsArray.length;
    setSaving(true)

    if (lengthOfRejectedAndAcceptedArray < lengthOfAllProducts) {
      const remaining = _.xorWith(rejectedAndAcceptedArray, allProductsArray, _.isEqual);

      func.setRejectedItems((prevState: Record<string, any>[]) => {
        sessionStorage.setItem('rejectedItems', JSON.stringify([...rejectedItems, ...remaining]))
        return [
          ...prevState,
          ...remaining
        ]
      });
      
      Promise.all([
        CartController.saveAcceptedProducts(acceptedItems), 
        CartController.saveRejectedProducts(rejectedItems)
      ]).then(async([res1, res2]) => {
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        console.log('data =>', [data1, data2])
        Router.push('./confirmationPage');
        setSaving(false)
      })
      .catch(err => console.log(err))
      
    } else {
      Promise.all([
        CartController.saveAcceptedProducts(acceptedItems), 
        CartController.saveRejectedProducts(rejectedItems)
      ]).then(async([res1, res2]) => {
        const data1 = await res1.json();
        const data2 = await res2.json();

        console.log('data =>', [data1, data2])
        Router.push('./confirmationPage')
        setSaving(false)
      })
      .catch(err => console.log(err))
    }
  }

  const displayCorrectCart = (value:number) => {
    switch (value) {
      case cartState.length:
        const itemsFilteredByPrice = _.filter(allProductsArray, function(value) { return value?.total <= filterValue; });
        return itemsFilteredByPrice.map((
          product, 
          idx: number
        ) => {
          return(
            <CartItem 
              key={idx}
              item={product}
            />
          )      
        });
    
      default:
        const currentCartProducts = cartState[activeCart]?.products;
        const productFilteredByPrice = _.filter(currentCartProducts, function(value) { return value?.total <= filterValue; });
        const childCart = productFilteredByPrice.map((
          item: Record<string, any>, 
          idx: number
        ) => (
          <CartItem 
            key={item?.id}
            item={item}
          />
        ));
        return childCart;
    }
  }

  useEffect(() => {
    const retrieveCartData = () => {
      const carts = sessionStorage.getItem('cartState');
      const parsedData = carts === null ? null :  JSON.parse(carts);

      if (parsedData !== null) {
        const totalPrices = _.map(getAllCarts(parsedData), 'total');
        const max = Math.max(...totalPrices);
  
        func.setCartState(parsedData);
        setActiveCart(parsedData.length);
        setFilterValue(max);
        setIsLoading(false)
      } else {
        fetch('https://dummyjson.com/carts?limit=5')
          .then(res => res.json())
          .then(data => {
            const totalPrices = _.map(getAllCarts(data.carts), 'total');
            const max = Math.max(...totalPrices);
  
            sessionStorage.setItem('cartState', JSON.stringify(data.carts))
            func.setCartState(data.carts);
            setActiveCart(data.carts.length)
            setFilterValue(max)
            setIsLoading(false)
          }).catch(err => console.log(err))
      }
    };

    const retreiveAcceptedProductsData = () => {
      // @ts-ignore: Unreachable code error
      const acceptedProducts = JSON.parse(sessionStorage.getItem('acceptedItems'));

      if (acceptedProducts !== null) {
        func.setAcceptedItems(() => {
          return acceptedProducts;
        });
      }
    }

    const retreiveRejectedProductsData = () => {
      // @ts-ignore: Unreachable code error
      const rejectedProducts = JSON.parse(sessionStorage.getItem('rejectedItems'));

      if (rejectedProducts !== null) {
        func.setRejectedItems(() => {
          return rejectedProducts;
        });
      }
    }

    retrieveCartData();
    retreiveAcceptedProductsData();
    retreiveRejectedProductsData();
    
  }, [isBrowserLoaded]);

  if (isloading) {
    return (
      <div id='loading'>
        <h2>Loading...</h2>
      </div>
    )
  }
  
  return (
    <Frame>
      <div className='main'>
        <div className="flexRowBetween">
          <h2>Droppe Xmas &#127876; | Cart(s)</h2>
          <h2>Total: ${totalAcceptedProductCostWithOutDiscount}</h2>
        </div>
        <div className="flexAlignItemCenter" id='cartOptionFeature'>
          <div className="flexAlignItemCenter" id='cartInputSection'>
            <div className="flexAlignItemCenter" id='cartInputContainer'>
              <label htmlFor="cart">Select Cart:</label>
              
              <select name="cart" id="cart" onChange={handleSelectCart}>
                <option value={cartState.length}>All</option>
                {cartState.map((value: any, idx: number) => (
                  <option key={idx} value={idx}>Child {idx + 1}</option>
                ))}
                
              </select>
            </div>
            <div className="flexAlignItemCenter">
              <label htmlFor="myRange" style={{marginRight: '0.6rem'}}>Filter By Price:</label>
              <span>${min}</span>
              <input type="range" min={min} max={max} className="slider" id="myRange" value={filterValue} onChange={handleChangeFilter} />
              <span>${max}</span>
              <input type='text' id='filterValue' value={filterValue} disabled />
            </div>
          </div>
          <div className="flexAlignItemCenter">
            <button type='button' className='acceptBtn' onClick={handleAcceptAllItems} >Accept All</button>
            <button type='button' className='rejectBtn' onClick={handleRejectAllItems} >Reject All</button>
          </div>
        </div>
        <ProductTable>
          {displayCorrectCart(activeCart)}
        </ProductTable>
        <div>
          <p style={{textAlign: 'center'}}>There are a total of {displayCorrectCart(activeCart).length} items in this view</p>
          <p id='warning'>*All Items left neither accepted nor rejected will be automatically rejected</p>
        </div>
        <div id='continueSection'>
          <button type='button' id='continueBtn' onClick={handleContinue}>{saving ? 'Loading...' : 'Continue'}</button>
        </div>
      </div>
    </Frame>
  )
};

export default CartPage;

