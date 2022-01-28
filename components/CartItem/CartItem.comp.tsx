import React from 'react';
import styles from './CartItem.module.css';
import { CartContext } from 'context/cartContext';
import _ from 'lodash';

interface CartItemProps {
  title: string;
  price: number;
  quantity: number;
  id: number;
  index: number;
  userId?: number;
}

const CartItem = ({title, price, quantity, id, index, userId}: CartItemProps): JSX.Element => {
  const {cartState, func, acceptedItems, rejectedItems} = React.useContext(CartContext);
  const isAccepted = _.find(acceptedItems, ['id', id]);
  const isRejected = _.find(rejectedItems, ['id', id]);
  const selectIndex = _.findIndex(cartState, ['userId', userId]);
  console.log('selectIndex -->', selectIndex, userId)
  const bgColor = isAccepted ? '#b2ebb6' : isRejected ? '#fedae3' : '#e6e9ea';

  return (
    <div className={styles.container} style={{backgroundColor: bgColor}}>
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
        {isRejected  && <button type='button' id={styles.acceptBtn} onClick={() => func.handleAcceptItem(id)}>Accept</button>}
        {isAccepted && <button type='button' id={styles.rejectBtn} onClick={() => func.handleRejectItem(id)}>Reject</button>}
        {
          !isAccepted && !isRejected && (
            <>
              <button type='button' id={styles.acceptBtn} onClick={() => func.handleAcceptItem(id)}>Accept</button>
              <button type='button' id={styles.rejectBtn} onClick={() => func.handleRejectItem(id)}>Reject</button>
            </>
          )
        }
      </div>
    </div>
  );
};

export default CartItem;
