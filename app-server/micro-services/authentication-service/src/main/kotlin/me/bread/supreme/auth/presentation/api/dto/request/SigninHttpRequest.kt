package me.bread.supreme.auth.presentation.api.dto.request

import com.fasterxml.jackson.annotation.JsonProperty

data class SigninHttpRequest(
	@JsonProperty("email") val email: String,
	@JsonProperty("password") val password: String,
)
