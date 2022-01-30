class CartController {
    static saveAcceptedProducts (acceptedItems: Record<string, any>[]) {
        const fetchData =  fetch('https://dummyjson.com/carts/add', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    userId: 1,
                                    products: acceptedItems
                                })
                            })

        return fetchData
    }

    static saveRejectedProducts (rejectedItems: Record<string, any>[]) {
        const fetchData = fetch('https://dummyjson.com/carts/add', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    userId: 2,
                                    products: rejectedItems
                                })
                            })
        return fetchData
    }
};

export default CartController;