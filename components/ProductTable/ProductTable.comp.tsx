import React, { ReactNode } from 'react';

interface ProductTableProps {
  children: ReactNode,
  width?: string;
}

const ProductTable = ({children, width}: ProductTableProps) => {
    return (
        <div className="itemSection" style={{width: width}}>
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
            <div className='itemsContainer'>
              {children}
            </div>
        </div>
    );
};

export default ProductTable;
