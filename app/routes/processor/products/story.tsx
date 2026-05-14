import { ProductStoryPage } from '~/components/product-story-page'

export default function ProductStory() {
  return (
    <ProductStoryPage
      dashboardHref="/processor"
      productsHref="/processor/products"
      productContext="processor"
    />
  )
}
