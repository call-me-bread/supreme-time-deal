package me.bread.supreme.customer.domain.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Table(name = "customer")
class Customer(
	val nickname: String,
	val createdAt: LocalDateTime = LocalDateTime.now(),
	val updatedAt: LocalDateTime = LocalDateTime.now(),
	val deletedAt: LocalDateTime = LocalDateTime.now(),
	val isDeleted: Boolean = false,
) {
	fun order() {}

	fun changeAddress() {}

	fun choice(productId: Long) {}
}
