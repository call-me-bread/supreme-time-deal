package me.bread.supreme.integration

import me.bread.supreme.integration.domain.authorization.entity.Authentication
import me.bread.supreme.integration.domain.authorization.vo.Email
import me.bread.supreme.integration.domain.authorization.vo.Password
import me.bread.supreme.integration.domain.authorization.vo.PhoneNumber
import me.bread.supreme.integration.domain.customer.Customer
import me.bread.supreme.integration.domain.customer.Role
import me.bread.supreme.integration.domain.order.vo.Address

object Fixtures {
	fun aCustomer(): Customer {
		return Customer(
			role = Role.USER,
			address = Address(
				city = "Vishterich",
				province = "maiestatis",
				detail = "Saint Vincent and the Grenadines"
			),
			authentication = Authentication(
				email = Email("octavio.daniel@example.com"),
				password = Password("interpretaris"),
				phoneNumber = PhoneNumber("010-363-4319"),
			)
		)
	}
}
