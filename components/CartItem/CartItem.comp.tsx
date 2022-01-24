import React from 'react';
import styles from './CartItem.module.css';
import { CartContext } from 'context/cartContext';

interface CartItemProps {
  title: string;
  price: number;
  quantity: number;
}

const CartItem = ({title, price, quantity}: CartItemProps): JSX.Element => {
  // const {cartState} = React.useContext(CartContext);
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span>{title}</span>
      </div>
      <div className={styles.section}>
        <span>{quantity}</span>
      </div>
      <div className={styles.section}>
        <span>${price}</span>
      </div>
      <div className={styles.section}>
        <button type='button' id={styles.acceptBtn}>Accept</button>
        <button type='button' id={styles.rejectBtn}>Reject</button>
      </div>
    </div>
  );
};

export default CartItem;
