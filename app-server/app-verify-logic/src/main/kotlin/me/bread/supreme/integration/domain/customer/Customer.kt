package me.bread.supreme.integration.domain.customer

import me.bread.supreme.integration.domain.order.Address
import me.bread.supreme.integration.domain.secret.Secret

class Customer(
	val role: Role,
	val address: Address,
	val secret: Secret,
) {
	fun create() {

	}
}
