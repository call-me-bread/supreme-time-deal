package me.bread.supreme.auth.presentation.api.dto.response

import com.fasterxml.jackson.annotation.JsonProperty

data class SigninHttpResponse(
	@JsonProperty("token") val token: String,
)
