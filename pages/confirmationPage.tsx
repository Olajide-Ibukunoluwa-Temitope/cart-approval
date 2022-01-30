import Frame from '@/components/Frame/Frame.comp';
import ProductTable from '@/components/ProductTable/ProductTable.comp';
import { CartContext } from '../context/cartContext';
import React, {useEffect} from 'react';
import CartItem from '@/components/CartItem/CartItem.comp';
import { 
    countDuplicatesInArray, 
    getAllDiscounts, 
    getAllProductIds, 
    getDiscountsArray, 
    getDuplicateProductsArray 
} from 'utils';
import _ from 'lodash';

const ConfirmationPage = () => {
    const { func, totalAcceptedProductCostWithOutDiscount, totalRejectedProductCost, acceptedItems, rejectedItems} = React.useContext(CartContext);

    const displayRejectedList = () => {
        const list = rejectedItems.map((product: Record<string, any>, idx: number) => (
            <CartItem
              key={idx}
              item={product}
            />
        ));

        return list;
    }

    const displayAcceptedList = () => {
        const list = acceptedItems.map((product: Record<string, any>, idx: number) => (
            <CartItem
              key={idx}
              item={product}
            />
        ));

        return list;
    }

    const getDiscountsForProducts = () => {
        const allProductsIdArray = getAllProductIds(acceptedItems);
        const countOfAcceptedProductsPerCart = countDuplicatesInArray(allProductsIdArray);
        const arrayOfDuplicateProductId = getDuplicateProductsArray(countOfAcceptedProductsPerCart);
        const arrayOfpercentDiscount = getDiscountsArray(arrayOfDuplicateProductId, countOfAcceptedProductsPerCart);
        const discountData = getAllDiscounts(arrayOfDuplicateProductId, acceptedItems, arrayOfpercentDiscount, allProductsIdArray);

        return discountData;
    }

    const discountInfo = getDiscountsForProducts();
    const arrayOfDiscountPrices = discountInfo.map((value) => value?.discountedPrice);
    const totalDiscountsOnAllItems = _.reduce(arrayOfDiscountPrices, function(sum, n) {
        return sum + n;
    }, 0);
    const amountToBePaid = totalAcceptedProductCostWithOutDiscount - totalDiscountsOnAllItems;
    
    useEffect(() => {
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
        retreiveAcceptedProductsData();
        retreiveRejectedProductsData();
        
    }, []);

    return (
        <Frame>
            <div className='main'>
                <div className="flexRowBetween">
                    <h2>Droppe Xmas &#127876; | Overview</h2>
                </div>
                <div className='flexRowBetween'>
                    {
                        discountInfo.length > 0 && (
                            <div id='discountData' className='sectionContainer'>
                                <h4>Discount Information</h4>
                                {
                                    discountInfo.map((value, idx) => (
                                        <p key={idx}>
                                            {value?.percentageDiscount}% discount on {value?.productTitle}
                                        </p>
                                    ))
                                }
                            </div>
                        )
                    }
                    
                    <div id='totalData' className='sectionContainer'>
                        <h4>Cost Information</h4>
                        {
                            discountInfo.length > 0 ? (
                                <>
                                    <p>Total Before Discount: ${Math.round(totalAcceptedProductCostWithOutDiscount)}</p>
                                    <p>Total After Discount: ${Math.round(amountToBePaid)}</p>
                                    <p>Amount saved from discount: ${Math.round(totalAcceptedProductCostWithOutDiscount - amountToBePaid)}</p>
                                </>
                            ) : (
                                <>
                                    <p>Total: ${Math.round(amountToBePaid)}</p>
                                </>
                            )
                        }
                        
                    </div>
                    
                </div>
                <div className='overviewContainer'>
                    <div className='sectionContainer' id='rejectedSectionContainer'>
                        <div>
                            <div className='flexRowBetween'>
                                <h3>Rejected List</h3>
                                <h4>Total: ${totalRejectedProductCost}</h4>
                            </div>
                            <p>No of items in List: {rejectedItems.length}</p>
                        </div>
                        
                        
                        <div>
                            <ProductTable width='100%'>
                                {displayRejectedList()}
                            </ProductTable>
                        </div>
                    </div>
                    <div className='sectionContainer' id='acceptedSectionContainer'>
                        <div>
                            <div className='flexRowBetween'>
                                <h3>Accepted List</h3>
                                <h4>Total: ${totalAcceptedProductCostWithOutDiscount}</h4>
                            </div>
                            <p>No of items in List: {acceptedItems.length}</p>
                        </div>
                        
                        <div>
                            <ProductTable width='100%'>
                                {displayAcceptedList()}
                            </ProductTable>
                        </div>
                    </div>
                </div>
            </div>
        </Frame>
    );
};

export default ConfirmationPage;
