package me.bread.supreme.customer.application

import me.bread.supreme.customer.domain.entity.Customer

data class CustomerInfo(
	val nickname: String,
) {
	fun entity() = Customer(nickname = nickname)
}
