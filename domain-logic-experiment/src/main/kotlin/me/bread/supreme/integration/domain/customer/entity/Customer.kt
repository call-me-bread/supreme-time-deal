package me.bread.supreme.integration.domain.customer.entity

import me.bread.supreme.integration.domain.auth.entity.Authentication
import me.bread.supreme.integration.domain.customer.enums.Role
import me.bread.supreme.integration.domain.order.vo.Address

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
