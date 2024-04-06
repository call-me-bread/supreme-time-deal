package me.bread.supreme.integration.domain

import java.time.LocalDateTime

class Stock(
	var endedAt: LocalDateTime,
) {
	fun enoughItems() {}

	fun checkNotEnded() {}
}
