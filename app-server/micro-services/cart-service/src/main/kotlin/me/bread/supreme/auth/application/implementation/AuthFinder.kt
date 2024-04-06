package me.bread.supreme.auth.application.implementation

import me.bread.supreme.auth.domain.repository.AuthRepository
import me.bread.supreme.support.exception.EmailNotFoundException
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class AuthFinder(
	private val authRepository: AuthRepository,
) {
	@Transactional(readOnly = true)
	fun find(email: String) =
		authRepository.findByEmail(email)
			?: throw EmailNotFoundException(email)
}
