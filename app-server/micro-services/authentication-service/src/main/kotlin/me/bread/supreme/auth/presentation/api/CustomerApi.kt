package me.bread.supreme.auth.presentation.api

import me.bread.supreme.auth.application.AuthService
import me.bread.supreme.auth.config.security.CustomUserDetails
import me.bread.supreme.auth.config.security.JwtProcessor
import me.bread.supreme.auth.presentation.api.dto.request.SigninHttpRequest
import me.bread.supreme.auth.presentation.api.dto.request.SignupHttpRequest
import me.bread.supreme.auth.presentation.api.dto.response.SigninHttpResponse
import me.bread.supreme.auth.presentation.api.dto.response.SignupHttpResponse
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono

@RestController
class CustomerApi(
	private val authenticationManager: ReactiveAuthenticationManager,
	private val authService: AuthService,
	private val jwtProcessor: JwtProcessor,
) {
	@PostMapping("/auth/v1/sign-up")
	fun signup(
		@RequestBody dto: SignupHttpRequest,
	): Mono<SignupHttpResponse> {
		return authService.register(dto)
			.map { passwordCredential -> SignupHttpResponse(passwordCredential != null) }
	}

	@PostMapping("/auth/v1/sign-in")
	fun signin(
		@RequestBody dto: SigninHttpRequest,
	): Mono<SigninHttpResponse> {
		return authenticationManager.authenticate(
			UsernamePasswordAuthenticationToken(dto.email, dto.password),
		).onErrorMap { exception ->
			ResponseStatusException(HttpStatus.UNAUTHORIZED, exception.message, exception)
		}.map { authentication ->
			val userDetails = authentication.principal as CustomUserDetails
			val token = jwtProcessor.generateToken(userDetails)
			SigninHttpResponse(token)
		}
	}
}
