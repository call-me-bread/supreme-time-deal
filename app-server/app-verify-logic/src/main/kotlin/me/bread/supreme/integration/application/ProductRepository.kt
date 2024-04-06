package me.bread.supreme.integration.application

import me.bread.supreme.integration.domain.Product

interface ProductRepository {
	fun findAll(type: ProductType): List<Product>
}
