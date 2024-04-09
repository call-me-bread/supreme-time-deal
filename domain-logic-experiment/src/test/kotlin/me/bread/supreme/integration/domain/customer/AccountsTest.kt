package me.bread.supreme.integration.domain.customer

import me.bread.supreme.integration.Fixtures
import me.bread.supreme.integration.domain.accounts.entity.Authentication
import me.bread.supreme.integration.domain.accounts.vo.Email
import me.bread.supreme.integration.domain.accounts.vo.Password
import me.bread.supreme.integration.domain.accounts.vo.PhoneNumber
import me.bread.supreme.integration.domain.accounts.enums.Role
import me.bread.supreme.integration.domain.order.vo.Address
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class AccountsTest {

	@Test
	fun `success when create customer`() {
		// Given
		val role = Role.USER
		val address = Address(
			city = "Vishterich",
			province = "maiestatis",
			detail = "Saint Vincent and the Grenadines"
		)
		val authentication = Authentication(
			email = Email("invalid.email@example.com"),
			password = Password("interpretaris"),
			phoneNumber = PhoneNumber("010-363-4319"),
		)


		// When Then
		assertEquals(role, Fixtures.aCustomer().role)
		assertEquals(address, Fixtures.aCustomer().address)
		assertEquals(authentication, Fixtures.aCustomer().authentication)
	}

}
