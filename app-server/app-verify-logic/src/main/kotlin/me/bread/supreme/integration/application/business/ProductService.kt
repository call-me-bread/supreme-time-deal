package me.bread.supreme.integration.application.business

import me.bread.supreme.integration.domain.product.entity.Product
import me.bread.supreme.integration.domain.product.repsository.ProductRepository
import me.bread.supreme.integration.domain.product.enums.ProductType

class ProductService(
	private val productRepository: ProductRepository,
) {
	fun list(type: ProductType): List<Product> {
		return productRepository.findAll(type)
	}
}
