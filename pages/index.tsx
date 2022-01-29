import React, { useEffect, useState, } from "react";
import CartItem from "@/components/CartItem/CartItem.comp";
import Frame from "@/components/Frame/Frame.comp";
import { CartContext } from "context/cartContext";
import _, { filter } from 'lodash';
import { getAllCarts } from "utils";

const isBrowserLoaded = typeof window !== 'undefined';

const CartPage = (): JSX.Element => {
  const [cartState, setCartState] = useState<Array<Record<string, any>>>([]);
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [activeCart, setActiveCart] = useState<number>(0);
  const [acceptedItems, setAcceptedItems] = useState<Array<Record<string, any>>>([]);
  const [rejectedItems, setRejectedItems] = useState<Array<Record<string, any>>>([]);
  const [filterValue, setFilterValue] = useState<number>(0);

  const allTotalAcceptedPrices = _.map(acceptedItems, 'total');
  
  const totalAcceptedPrice = _.reduce(allTotalAcceptedPrices, function(sum, n) {
    return sum + n;
  }, 0);

  const totalPrices = _.map(getAllCarts(cartState), 'total');
  const max = Math.max(...totalPrices);
  const min = Math.min(...totalPrices);

  const handleSelectCart = (event: React.FormEvent<HTMLSelectElement>) => {
    setActiveCart(Number(event.currentTarget.value));
  };

  const handleChangeFilter = (event: React.FormEvent<HTMLInputElement>) => {
    setFilterValue(Number(event.currentTarget.value));
  };

  const handleAcceptItem = (item: Record<string, any>) => {
    const allProducts = getAllCarts(cartState)
    const selectedProject = _.find(allProducts, item);
    const filteredArray = rejectedItems.filter((value) => value !== item)
    
    setAcceptedItems((prevState) => {
      return [
        ...prevState,
        selectedProject
      ]
    });

    setRejectedItems((prevState) => {
      return [
        ...filteredArray
      ]
    });
  }

  const handleRejectItem = (item: Record<string, any>) => {
    const allProducts = getAllCarts(cartState)
    const selectedProject = _.find(allProducts, item);
    const filteredArray = acceptedItems.filter((value) => value !== item)
    console.log('rejectedfilteredArray --->>>', filteredArray)
    setRejectedItems((prevState) => {
      return [
        ...prevState,
        selectedProject
      ]
    });

    setAcceptedItems((prevState) => {
      return [
        ...filteredArray
      ]
    });
  }

  const handleAcceptAllItems = () => {
    let items;
    let acceptedItems: Record<string, any>[];

    if (activeCart !== cartState.length){
      acceptedItems = _.uniqWith(cartState[activeCart]?.products, _.isEqual);
      setAcceptedItems((prevState) => {
        return [
          ...prevState,
          ...acceptedItems,
        ]
      });
      setRejectedItems((prevState) => {
        return [
          ...prevState
        ]
      });
    } else {
      items = getAllCarts(cartState);
      acceptedItems = _.uniqWith(items, _.isEqual);
      setAcceptedItems((prevState) => {
        return [
          ...acceptedItems,
        ]
      });
      setRejectedItems((prevState) => {
        return []
      });
    }

    
  };

  const handleRejectAllItems = () => {
    let items;
    let rejectedItems: Record<string, any>[];

    if (activeCart !== cartState.length){
      rejectedItems = _.uniqWith(cartState[activeCart]?.products, _.isEqual);
      setRejectedItems((prevState) => {
        return [
          ...prevState,
          ...rejectedItems,
        ]
      });
      setAcceptedItems((prevState) => {
        return [
          ...prevState
        ]
      });
      
    } else {
      items = getAllCarts(cartState);
      rejectedItems = _.uniqWith(items, _.isEqual);
      setRejectedItems((prevState) => {
        return [
          ...rejectedItems,
        ]
      });
      setAcceptedItems((prevState) => {
        return []
      });
    }

    setRejectedItems((prevState) => {
      return [
        ...rejectedItems,
      ]
    });
    setAcceptedItems((prevState) => {
      return []
    });
  }

  const displayCorrectCart = (value:number) => {
    switch (value) {
      case cartState.length:
        const allItems = getAllCarts(cartState);
        const itemsFilteredByPrice = _.filter(allItems, function(value) { return value?.total <= filterValue; });
        return itemsFilteredByPrice.map((
          product, 
          idx: number
        ) => {
          // const cartIndex = _.findIndex(cartState, {products: [product]});

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
    const carts = sessionStorage.getItem('cartState');
    const parsedData = carts === null ? null :  JSON.parse(carts);
    console.log('parsedData ==>>>', parsedData);

    if (parsedData !== null) {
      const totalPrices = _.map(getAllCarts(parsedData), 'total');
      const max = Math.max(...totalPrices);

      setCartState(parsedData);
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
          setCartState(data.carts);
          setActiveCart(data.carts.length)
          setFilterValue(max)
          setIsLoading(false)
        }).catch(err => console.log(err))
    }
    
  }, [isBrowserLoaded]);

  if (isloading) {
    return (
      <div id='loading'>
        <h2>Loading...</h2>
      </div>
    )
  }
  
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
            <h2>Total: ${totalAcceptedPrice}</h2>
          </div>
          <div className="flexAlignItemCenter" id='cartOptionFeature'>
            <div className="flexAlignItemCenter" id='cartInputSection'>
              <div className="flexAlignItemCenter" id='cartInputContainer'>
                <label htmlFor="cart">Select Cart:</label>
                
                <select name="cart" id="cart" onChange={handleSelectCart}>
                  <option value={cartState.length}>All</option>
                  {cartState.map((value, idx: number) => (
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
          <div>
            <p style={{textAlign: 'center'}}>There are a total of {displayCorrectCart(activeCart).length} items in this view</p>
            <p id='warning'>*All Items left neither accepted nor rejected will be automatically rejected</p>
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
          <div id='continueSection'>
            <button type='button' id='continueBtn' onClick={handleAcceptAllItems}>Continue</button>
          </div>
        </div>
      </Frame>
    </CartContext.Provider>
  )
};

export default CartPage;

