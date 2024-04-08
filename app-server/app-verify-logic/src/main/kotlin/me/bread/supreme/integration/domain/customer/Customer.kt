package me.bread.supreme.integration.domain.customer

import me.bread.supreme.integration.domain.order.vo.Address
import me.bread.supreme.integration.domain.authorization.entity.Authentication

class Customer(
	val role: Role,
	var address: Address,
	val authentication: Authentication,
) {
	companion object {
		fun create(role: Role, address: Address, authentication: Authentication): Customer {
			return Customer(role, address, authentication)
		}
	}

	fun editPersonalInfo(newAddress: Address) = this.address.updateTo(newAddress)

}
