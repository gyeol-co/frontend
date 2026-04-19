import { ProductDetailPage } from 'src/components/(products)';

interface ProductDetailRouteProps {
  params: Promise<{ id: string }>;
}

/**
 * Server component wrapper — resolves the dynamic `id` param and hands it
 * to the client `ProductDetailPage`. Data fetching happens client-side so
 * React Query can coexist with the wishlist toggle cache.
 */
const ProductDetailRoute = async ({ params }: ProductDetailRouteProps) => {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
};

export default ProductDetailRoute;
