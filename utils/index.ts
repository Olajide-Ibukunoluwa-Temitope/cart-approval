import _ from 'lodash';

export const getAllCarts = (cart: Record<string, any>[]) => {
    const allProducts = cart.map(({products}, idx) => {
        return products;
    });

    const allCarts = _.flattenDeep(allProducts);
    
    return allCarts;
};
