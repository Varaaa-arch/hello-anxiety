import React from 'react';
import { View, Text, Button } from 'react-native';

type Props = {
  product: { id: number; name: string; price: number };
};

const ProductCard = ({ product }: Props) => {
  const addToCart = () => {
    // nanti masuk context/cart
    console.log('Add to cart:', product.name);
  };

  return (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>{product.name}</Text>
      <Text>Rp{product.price}</Text>
      <Button title="Add to Cart" onPress={addToCart} />
    </View>
  );
};

export default ProductCard;
