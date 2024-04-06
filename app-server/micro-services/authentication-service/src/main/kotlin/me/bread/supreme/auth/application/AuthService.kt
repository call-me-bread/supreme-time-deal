package me.bread.supreme.auth.application

import me.bread.supreme.auth.domain.Auth
import me.bread.supreme.auth.domain.Role
import me.bread.supreme.auth.domain.Secret
import me.bread.supreme.auth.infra.jpa.SecretJpaRepository
import me.bread.supreme.auth.presentation.api.dto.request.SignupHttpRequest
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class AuthService(
	private val secretJpaRepository: SecretJpaRepository,
	private val passwordEncoder: PasswordEncoder,
) {
	fun register(signupHttpRequest: SignupHttpRequest): Mono<Secret> {
		val auth = Auth(signupHttpRequest.nickname, Role.USER)
		return Mono.just(
			secretJpaRepository.save(
				Secret(
					email = signupHttpRequest.email,
					password = passwordEncoder.encode(signupHttpRequest.password),
					auth = auth,
				),
			),
		)
	}
}
