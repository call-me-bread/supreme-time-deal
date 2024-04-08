package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.product.entity.Product

class Option(
	var name: String,
) {
	fun available(product: Product) {
	}
}
