package me.bread.spreme.gateway.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ValidateTokenResponseDTO(
	@JsonProperty("valid") val valid: Boolean,
)
