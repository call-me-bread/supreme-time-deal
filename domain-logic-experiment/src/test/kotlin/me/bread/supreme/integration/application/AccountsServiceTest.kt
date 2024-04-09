package me.bread.supreme.integration.application

import io.mockk.mockk
import me.bread.supreme.integration.application.business.AuthService
import me.bread.supreme.integration.domain.accounts.exception.NoAuthorizationException
import me.bread.supreme.integration.domain.accounts.repsository.AccountsRepository
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class AccountsServiceTest {

	private val accountsRepository: AccountsRepository = mockk()
	private val authService = AuthService(accountsRepository)

	@Test
	fun `fail when create customer with invalid token`() {
		// Given
		val token = "invalid-token"

		// When, Then
		assertThrows(NoAuthorizationException::class.java) {
			authService.isValid(token)
		}
	}

	@Test
	fun `success when create customer with valid token`() {
		// Given
		val validToken = "valid-token"

		// When, Then
		assertTrue(authService.isValid(validToken))
	}
}
