import Frame from '@/components/Frame/Frame.comp';
import ProductTable from '@/components/ProductTable/ProductTable.comp';
import { CartContext } from '../context/cartContext';
import React from 'react';
import CartItem from '@/components/CartItem/CartItem.comp';
import { countDuplicatesInArray, getAllDiscounts, getAllProductIds, getDiscountsArray, getDuplicateProductsArray } from 'utils';
import _ from 'lodash';

const ConfirmationPage = () => {
    const { totalWithOutDiscount, func, acceptedItems, rejectedItems} = React.useContext(CartContext);

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
        // console.log('countDuplicatesInArray ->', countDuplicatesInArray(d));
        const countOfAcceptedProductsPerCart = countDuplicatesInArray(allProductsIdArray);
        // console.log('getDuplicateProductsArray ->', getDuplicateProductsArray(r));
        const arrayOfDuplicateProductId = getDuplicateProductsArray(countOfAcceptedProductsPerCart);
        // console.log('getDiscountsArray ->', getDiscountsArray(t, r));
        const arrayOfpercentDiscount = getDiscountsArray(arrayOfDuplicateProductId, countOfAcceptedProductsPerCart);
        const discountData = getAllDiscounts(arrayOfDuplicateProductId, acceptedItems, arrayOfpercentDiscount, allProductsIdArray);

        return discountData;
    }

    console.log('getDiscountsForProducts ==>', getDiscountsForProducts());
    const discountInfo = getDiscountsForProducts();
    const arrayOfDiscountPrices = discountInfo.map((value) => value?.discountedPrice);
    const totalDiscountsOnAllItems = _.reduce(arrayOfDiscountPrices, function(sum, n) {
        return sum + n;
    }, 0);
    const amountToBePaid = totalWithOutDiscount - totalDiscountsOnAllItems;
    

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
                                    <p>Total Before Discount: ${Math.round(totalWithOutDiscount)}</p>
                                    <p>Total After Discount: ${Math.round(amountToBePaid)}</p>
                                    <p>Amount saved from discount: ${Math.round(totalWithOutDiscount - amountToBePaid)}</p>
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
                        <h3>Rejected List</h3>
                        <div>
                            <ProductTable width='100%'>
                                {displayRejectedList()}
                            </ProductTable>
                        </div>
                    </div>
                    <div className='sectionContainer' id='acceptedSectionContainer'>
                        <h3>Accepted List</h3>
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
