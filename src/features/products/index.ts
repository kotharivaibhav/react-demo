export {
  productReducer,
  fetchProductsPage,
  fetchProductById,
  resetProductList,
  setProductSearch,
  selectProductList,
  selectProductListStatus,
  selectProductHasMore,
  selectProductPage,
  selectProductTotalPages,
  selectSelectedProduct,
  selectProductDetailStatus,
} from './productSlice';
export {
  productsApi,
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  invalidateProductCache,
} from './productsApi';
