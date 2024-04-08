package me.bread.supreme.integration.domain.customer

import me.bread.supreme.integration.domain.order.Address
import me.bread.supreme.integration.domain.secret.Secret
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class CustomerTest {

	@Test
	fun `create customer`() {
		// Given
		val role = Role.USER
		val address = Address(
			city = "Vishterich",
			province = "maiestatis",
			country = "Saint Vincent and the Grenadines"
		)
		val secret = Secret(
			email = "octavio.daniel@example.com",
			password = "interpretaris",
			phoneNumber = "010-363-4319",
			phoneAuth = false
		)

		// When
		val customer = Customer(role, address, secret)

		// Then
		assertEquals(role, customer.role)
		assertEquals(address, customer.address)
		assertEquals(secret, customer.secret)
	}

}
