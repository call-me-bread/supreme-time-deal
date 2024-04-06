package me.bread.supreme.auth.presentation.api.dto.response

import com.fasterxml.jackson.annotation.JsonProperty

data class ValidateAuthHttpResponse(
	@JsonProperty("valid") val valid: Boolean,
	@JsonProperty("error") val error: String? = "",
)
