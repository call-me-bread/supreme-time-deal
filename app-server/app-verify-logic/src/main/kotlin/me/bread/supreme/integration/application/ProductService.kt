package me.bread.supreme.integration.application

import me.bread.supreme.integration.domain.product.Product
import me.bread.supreme.integration.domain.product.ProductRepository
import me.bread.supreme.integration.domain.product.ProductType

class ProductService(
	private val productRepository: ProductRepository,
) {
	fun list(type: ProductType): List<Product> {
		return productRepository.findAll(type)
	}
}
