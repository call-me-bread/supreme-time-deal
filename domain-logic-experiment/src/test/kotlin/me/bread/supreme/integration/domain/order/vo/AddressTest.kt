package me.bread.supreme.integration.domain.order.vo

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Test

class AddressTest {
	@Test
	fun `success when address updates`() {
		// Given
		val originalAddress = Address("Seoul", "Seoul", "123 Main St")
		val newAddress = Address("Busan", "Gyeongsangnam-do", "456 Elm St")

		// When
		val updatedAddress = originalAddress.updateTo(newAddress)

		// Then
		assertEquals(newAddress.city, updatedAddress.city)
		assertEquals(newAddress.province, updatedAddress.province)
		assertEquals(newAddress.detail, updatedAddress.detail)
	}


	@Test
	fun `fail when the original address not valid`() {
		// Given
		val originalAddress = Address("Seoul", "Seoul", "123 Main St")
		val newAddress = Address("Busan", "Gyeongsangnam-do", "456 Elm St")

		// When
		originalAddress.updateTo(newAddress)

		// Then
		assertNotEquals(newAddress.city, originalAddress.city)
		assertNotEquals(newAddress.province, originalAddress.province)
		assertNotEquals(newAddress.detail, originalAddress.detail)
	}
}
