package me.bread.supreme.integration.application

import io.mockk.mockk
import me.bread.supreme.integration.domain.secret.SecretRepository
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.nio.file.AccessDeniedException

class SecretServiceTest {
	private val secretRepository: SecretRepository = mockk()
	private val secretService = SecretService(secretRepository)

	@Test
	fun `create customer with invalid secret`() {
		// Given
		val token = "invalid token"

		// When, Then
		assertThrows(AccessDeniedException::class.java) {
			secretService.checkLogin(token)
		}
	}
}
