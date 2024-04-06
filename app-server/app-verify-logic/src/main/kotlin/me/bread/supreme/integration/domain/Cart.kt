package me.bread.supreme.integration.domain

class Cart(
	var products: MutableList<Product> = mutableListOf(),
) {
	fun put(product: Product) {
		this.products.add(product)
	}
}
