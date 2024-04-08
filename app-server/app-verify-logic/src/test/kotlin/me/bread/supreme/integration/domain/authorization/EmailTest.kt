package me.bread.supreme.integration.domain.authorization

import me.bread.supreme.integration.domain.authorization.exception.InvalidFormatEmailException
import me.bread.supreme.integration.domain.authorization.vo.Email
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class EmailTest {
	@Test
	fun `Create email with invalid format`() {
		// Given
		val invalidFormatEmail = "invalid.email.example.com"

		// When Then
		assertThrows<InvalidFormatEmailException> {
			Email(invalidFormatEmail)
		}

	}
}
