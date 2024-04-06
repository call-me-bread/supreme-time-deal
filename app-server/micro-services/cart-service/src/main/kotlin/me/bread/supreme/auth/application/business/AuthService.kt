package me.bread.supreme.auth.application.business

import me.bread.supreme.auth.application.AuthInfo
import me.bread.supreme.auth.application.implementation.AuthAppender
import me.bread.supreme.auth.application.implementation.AuthFinder
import me.bread.supreme.auth.application.implementation.TokenProvider
import me.bread.supreme.auth.domain.entity.Auth
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
	private val authFinder: AuthFinder,
	private val authAppender: AuthAppender,
	private val tokenProvider: TokenProvider,
	private val encoder: PasswordEncoder,
) {
	@Transactional
	fun createToken(
		email: String,
		password: String,
	): String {
		return tokenProvider.createToken("${authFinder.find(email)}")
	}

	@Transactional
	fun createAuth(authInfo: AuthInfo): String {
		authAppender.save(Auth(email = authInfo.email, passwordHash = encoder.encode(authInfo.password)))
		return tokenProvider.createToken("${authFinder.find(authInfo.email)}")
	}
}
