package me.bread.supreme.integration.domain.product

interface ProductRepository {
	fun findAll(type: ProductType): List<Product>
}
