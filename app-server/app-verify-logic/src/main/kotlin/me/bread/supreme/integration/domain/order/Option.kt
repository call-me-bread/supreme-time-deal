package me.bread.supreme.integration.domain.order

import me.bread.supreme.integration.domain.product.Product

class Option(
	var name: String,
) {
	fun available(product: Product) {
	}
}
