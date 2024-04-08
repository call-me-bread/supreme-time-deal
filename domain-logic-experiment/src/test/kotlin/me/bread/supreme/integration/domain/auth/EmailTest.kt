package me.bread.supreme.integration.domain.auth

import me.bread.supreme.integration.domain.auth.exception.InvalidFormatEmailException
import me.bread.supreme.integration.domain.auth.vo.Email
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

class EmailTest {

	@Test
	fun `success when true for valid email`() {
		// Given
		val validEmail = Email("test@example.com")

		// Then
		assertNotNull(validEmail)
	}

	@Test
	fun `exception for invalid email`() {
		// When, Then
		assertThrows(InvalidFormatEmailException::class.java) {
			Email("invalid-email")
		}
	}
}
