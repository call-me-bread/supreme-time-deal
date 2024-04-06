package me.bread.supreme.auth.presentation.api.dto.request

import com.fasterxml.jackson.annotation.JsonProperty

data class ValidateAuthHttpRequest(
	@JsonProperty("token") val token: String,
)
