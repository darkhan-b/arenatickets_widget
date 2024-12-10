export const cartDataAdapter = (data: Array<any>) => {
  return data.map((item) => {
    return {
      options: Object.values(item.options).map((option: any) => option.id),
      quantity: item.quantity,
      product_id: item.product.id
    }
  })
}
