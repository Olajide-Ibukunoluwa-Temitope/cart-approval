import React, { ReactNode } from 'react';
import styles from './ProductTable.module.css'

interface ProductTableProps {
  children: ReactNode,
  width?: string;
}

const ProductTable = ({children, width}: ProductTableProps) => {
    return (
        <div className={styles.itemSection}style={{width: width}}>
            <div className={`${styles.titles} flexRowBetween`}>
              <div className={styles.title}>
                <span>Product Name</span>
              </div>
              <div className={styles.title}>
                <span>Quantity</span>
              </div>
              <div className={styles.title}>
                <span>Price</span>
              </div>
              <div className={styles.title}>
                <span>Accept/Reject</span>
              </div>
            </div>
            <div className={styles.itemsContainer}>
              {children}
            </div>
        </div>
    );
};

export default ProductTable;
