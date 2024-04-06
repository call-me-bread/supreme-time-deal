package me.bread.supreme.auth.application.implementation

import me.bread.supreme.auth.domain.entity.Auth
import me.bread.supreme.auth.domain.repository.AuthRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class AuthAppender(
	private val authRepository: AuthRepository,
) {
	@Transactional
	fun save(auth: Auth) {
		authRepository.save(auth)
	}
}
