package me.bread.supreme.auth.web.dto.request

import me.bread.supreme.auth.application.AuthInfo

data class AuthHttpRequest(
	val email: String,
	val password: String,
	val checkPassword: String,
	val verifyCode: String,
) {
	fun meaningful() = AuthInfo(email, password, checkPassword, verifyCode)
}
