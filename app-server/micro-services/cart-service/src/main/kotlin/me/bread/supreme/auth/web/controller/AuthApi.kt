package me.bread.supreme.auth.web.controller

import me.bread.supreme.auth.application.business.AuthService
import me.bread.supreme.auth.web.dto.request.AuthHttpRequest
import me.bread.supreme.auth.web.dto.response.AuthHttpResponse
import me.bread.supreme.support.wrapper.ApiResponseWrapper
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthApi(
	private val authService: AuthService,
) {
	@PostMapping("/v1/auth/login")
	fun login(
		email: String,
		password: String,
	): ApiResponseWrapper {
		return ApiResponseWrapper.success(AuthHttpResponse(authService.createToken(email, password)))
	}

	@PostMapping("/v1/auth")
	fun auth(
		@RequestBody dto: AuthHttpRequest,
	): ApiResponseWrapper {
		return ApiResponseWrapper.success(AuthHttpResponse(authService.createAuth(dto.meaningful())))
	}
}
