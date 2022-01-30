import React from 'react';
import styles from './CartItem.module.css';
import { CartContext } from '../../context/cartContext';
import _ from 'lodash';

interface CartItemProps {
  item?: Record<string, any>;
}

const CartItem = (props: CartItemProps): JSX.Element => {
  const {func, acceptedItems, rejectedItems} = React.useContext(CartContext);
  const isAccepted = _.find(acceptedItems, props?.item);
  const isRejected = _.find(rejectedItems, props?.item);
  const bgColor = isAccepted ? '#b2ebb6' : isRejected ? '#fedae3' : '#e6e9ea';
  

  return (
    <div className={styles.container} style={{backgroundColor: bgColor}}>
      <div className={styles.section}>
        <span>{props.item?.title}</span>
      </div>
      <div className={styles.section}>
        <span>{props.item?.quantity}</span>
      </div>
      <div className={styles.section}>
        <span>${props.item?.total}</span>
      </div>
      <div className={styles.section}>
        {isRejected && <button type='button' className='acceptBtn' onClick={() => func.handleAcceptItem(props?.item)}>Accept</button>}
        {isAccepted && <button type='button' className='rejectBtn' onClick={() => func.handleRejectItem(props?.item)}>Reject</button>}
        {
          !isAccepted && !isRejected && (
            <>
              <button type='button' className='acceptBtn' onClick={() => func.handleAcceptItem(props?.item)}>Accept</button>
              <button type='button' className='rejectBtn' onClick={() => func.handleRejectItem(props?.item)}>Reject</button>
            </>
          )
        }
      </div>
    </div>
  );
};

export default CartItem;
