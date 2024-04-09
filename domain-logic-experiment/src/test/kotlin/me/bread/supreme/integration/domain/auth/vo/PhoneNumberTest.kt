package me.bread.supreme.integration.domain.auth.vo

import me.bread.supreme.integration.domain.accounts.vo.PhoneNumber
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class PhoneNumberTest {

	@Test
	fun `success when valid phone number`() {
		// Given When
		val validPhoneNumber1 = PhoneNumber("+1234567890")
		val validPhoneNumber2 = PhoneNumber("+912345678901234") // 1-15 digits

		// Then
		assertTrue(validPhoneNumber1.isValid())
		assertTrue(validPhoneNumber2.isValid())
	}

	@Test
	fun `false when invalid phone number`() {
		// Given When
		val invalidPhoneNumber1 = PhoneNumber("1234567890") // Missing +
		val invalidPhoneNumber2 = PhoneNumber("+12345678a") // Contains non-numeric characters
		val invalidPhoneNumber3 = PhoneNumber("+1234567890123456") // More than 15 digits

		// Then
		assertFalse(invalidPhoneNumber1.isValid())
		assertFalse(invalidPhoneNumber2.isValid())
		assertFalse(invalidPhoneNumber3.isValid())
	}
}
