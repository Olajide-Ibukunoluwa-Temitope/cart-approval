import _ from 'lodash';

export const getAllCarts = (cart: Record<string, any>[]) => {
    const allProducts = cart.map(({products}, idx) => {
        return products;
    });

    const allCarts = _.flattenDeep(allProducts);
    
    return allCarts;
};

export const getAllProductIds = (productArray: Record<string, any>[]) => {
    const productIds = productArray.map(({id}) => id);
    return productIds;
};

export const countDuplicatesInArray = (array: string[] | number[] ) => {
    const counts: Record<string, any> = {};

    array.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1;
    });
    // console.log(counts);
    return counts;
}

export const getDuplicateProductsArray = (productCountObj: Record<string, any>) => {
  const productDuplicates = Object.keys(productCountObj).filter((a) => productCountObj[a] > 1);
  return productDuplicates;
};

export const getDiscountsArray = (productsWithDuplicatesArray: string[], productCountObj: Record<string, any>) => {
    const discount = productsWithDuplicatesArray.map((value) => {
        const convertedToNumber = Number(value);
        return productCountObj[convertedToNumber]/10;
    });

    return discount;
}

export const findAllIndexesOfProduct = (productIdsArray: number[], productId: number) => {
    let indexes = [];
    let idx = productIdsArray.indexOf(productId);

    while (idx != -1) {
        indexes.push(idx);
        idx = productIdsArray.indexOf(productId, idx + 1);
    }
    console.log(indexes);
    return indexes;
}

export const getAllDiscounts = (duplicateProductsArray: string[], acceptedProductArray: Record<string, any>[], discountArray: number[], productIdsArray: number[]) => {
    const productDiscountArray = duplicateProductsArray.map((value, index) => {
        const convertedIdToNumber = Number(value);
        const product = _.find(acceptedProductArray, ['id', convertedIdToNumber]);
        const productIndexesArray = findAllIndexesOfProduct(productIdsArray, convertedIdToNumber);
        const productsPrices = productIndexesArray.map((value) => acceptedProductArray[value].total)
        const priceTotal = _.reduce(productsPrices, function(sum, n) {
            return sum + n;
        }, 0);
        const discountInPercentage = discountArray[index] * 100;
        const discountedPrice = priceTotal * discountArray[index];
        return {
            productTitle: product?.title,
            percentageDiscount: discountInPercentage,
            price: priceTotal,
            discountedPrice
        }
    })

    return productDiscountArray;

}


