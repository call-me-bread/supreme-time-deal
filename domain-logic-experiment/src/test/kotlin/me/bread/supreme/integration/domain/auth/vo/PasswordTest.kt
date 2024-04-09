package me.bread.supreme.integration.domain.auth.vo

import me.bread.supreme.integration.domain.accounts.vo.Password
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class PasswordTest {

	@Test
	fun `success when password with valid format`() {
		// Given When
		val validPassword = Password("Abcd1234")

		// Then
		assertTrue(validPassword.isValid())
	}

	@Test
	fun `success when password with invalid format`() {
		// Given When
		val invalidPassword1 = Password("abcd1234") // Missing uppercase
		val invalidPassword2 = Password("ABCD1234") // Missing lowercase
		val invalidPassword3 = Password("Abcd")    // Too short
		val invalidPassword4 = Password("abcdabcd") // Missing digit

		// Then
		assertFalse(invalidPassword1.isValid())
		assertFalse(invalidPassword2.isValid())
		assertFalse(invalidPassword3.isValid())
		assertFalse(invalidPassword4.isValid())
	}

	@Test
	fun `success when password meets length requirement`() {
		// Given When
		val shortPassword = Password("abcd") // Too short
		val longPassword = Password("Abcd123456") // Satisfies minimum length

		// Then
		assertTrue(longPassword.meetsLengthRequirement())
		assertFalse(shortPassword.meetsLengthRequirement())
	}

	@Test
	fun `success when password contains uppercase`() {
		val passwordWithoutUppercase = Password("abcd1234")
		val passwordWithUppercase = Password("Abcd1234")
		assertTrue(passwordWithUppercase.containsUpperCase())
		assertFalse(passwordWithoutUppercase.containsUpperCase())
	}

	@Test
	fun `password contains lowercase`() {
		val passwordWithoutLowercase = Password("ABCD1234")
		val passwordWithLowercase = Password("Abcd1234")
		assertTrue(passwordWithLowercase.containsLowerCase())
		assertFalse(passwordWithoutLowercase.containsLowerCase())
	}

	@Test
	fun `password contains digit`() {
		val passwordWithoutDigit = Password("Abcdabcd")
		val passwordWithDigit = Password("Abcd1234")
		assertTrue(passwordWithDigit.containsDigit())
		assertFalse(passwordWithoutDigit.containsDigit())
	}
}
