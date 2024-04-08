package me.bread.supreme.integration.domain.product.vo

import java.time.LocalDateTime

class Stock(
	var quantity: Int,
	var endedAt: LocalDateTime,
) {
	fun enoughItems() {}

	fun checkNotEnded() {}
}
