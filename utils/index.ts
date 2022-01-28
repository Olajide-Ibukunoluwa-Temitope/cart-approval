import _ from 'lodash';

export const getAllCarts = (cart: Record<string, any>[]) => {
    let userIdCart;
    let allItems = [];
    const allProducts = cart.map(({products, userId}, idx) => {
        // allItems.push(products)
        // return {
        //     userId,
        //     products
        // }
        return products;
    });
    // console.log('allproducts ->', allProducts)
    const allCarts = _.flattenDeep(allProducts)

    // console.log('allCarts ->', allCarts)
    
    return allCarts;
};

export const getSpecificItem = (cartArr: Record<string, any>[], id: number) => {    
    return _.find(cartArr, ['id', id]);
};