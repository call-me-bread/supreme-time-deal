package me.bread.supreme.integration.application

import me.bread.supreme.integration.domain.Product

class ProductService(
	private val productRepository: ProductRepository,
) {
	fun list(type: ProductType): List<Product> {
		return productRepository.findAll(type)
	}
}
