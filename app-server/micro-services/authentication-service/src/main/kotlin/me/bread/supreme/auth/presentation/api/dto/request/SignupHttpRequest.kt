package me.bread.supreme.auth.presentation.api.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class SignupHttpRequest(
	@field:Email @field:NotNull val email: String,
	@field:Size(min = 6, max = 10) @field:NotNull val password: String,
	@field:NotNull @field:Size(min = 6, max = 12) val nickname: Long,
)
