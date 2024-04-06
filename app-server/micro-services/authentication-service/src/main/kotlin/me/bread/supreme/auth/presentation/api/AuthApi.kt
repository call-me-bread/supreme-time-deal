package me.bread.supreme.auth.presentation.api

import com.auth0.jwt.exceptions.JWTVerificationException
import me.bread.supreme.auth.config.security.JwtProcessor
import me.bread.supreme.auth.presentation.api.dto.request.SigninHttpRequest
import me.bread.supreme.auth.presentation.api.dto.request.ValidateAuthHttpRequest
import me.bread.supreme.auth.presentation.api.dto.response.ValidateAuthHttpResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
class AuthApi(
	private val jwtProcessor: JwtProcessor,
) {
	@GetMapping("/auth/v1/refresh")
	fun refresh(
		@RequestBody request: SigninHttpRequest,
	) {
		TODO("Not yet implemented")
	}

	@PostMapping("/auth/v1/validate")
	fun validateToken(
		@RequestBody request: ValidateAuthHttpRequest,
	): Mono<ValidateAuthHttpResponse> {
		try {
			jwtProcessor.validateToken(request.token)
		} catch (exception: JWTVerificationException) {
			return Mono.just(ValidateAuthHttpResponse(false, exception.message))
		}

		return Mono.just(ValidateAuthHttpResponse(true))
	}
}
