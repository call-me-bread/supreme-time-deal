package me.bread.spreme.gateway.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ValidateTokenRequestDTO(
	@JsonProperty("token") val token: String,
)
