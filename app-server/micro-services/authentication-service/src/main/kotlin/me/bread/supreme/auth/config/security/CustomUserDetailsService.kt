package me.bread.supreme.auth.config.security

import me.bread.supreme.auth.infra.jpa.SecretJpaRepository
import org.springframework.http.HttpStatus
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono

@Service
class CustomUserDetailsService(
	private val secretJpaRepository: SecretJpaRepository,
) : ReactiveUserDetailsService {
	override fun findByUsername(email: String): Mono<UserDetails> {
		val passwordCredential = secretJpaRepository.findByEmail(email)

		return if (passwordCredential == null) {
			Mono.error(
				ResponseStatusException(
					HttpStatus.UNAUTHORIZED,
					String.format("No user found with email '%s'", email),
				),
			)
		} else {
			Mono.just(CustomUserDetails(passwordCredential))
		}
	}
}
