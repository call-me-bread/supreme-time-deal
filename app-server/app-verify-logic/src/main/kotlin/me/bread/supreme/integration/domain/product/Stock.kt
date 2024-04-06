package me.bread.supreme.integration.domain.product

import java.time.LocalDateTime

class Stock(
	var endedAt: LocalDateTime,
) {
	fun enoughItems() {}

	fun checkNotEnded() {}
}
