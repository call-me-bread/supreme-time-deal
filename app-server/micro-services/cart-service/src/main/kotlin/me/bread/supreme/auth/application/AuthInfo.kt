package me.bread.supreme.auth.application

import org.springframework.security.authentication.BadCredentialsException

data class AuthInfo(
	val email: String,
	val password: String,
	val checkPassword: String,
	val verifyCode: String,
) {
	init {
		if (this.password != this.checkPassword) {
			throw BadCredentialsException("Invalid password")
		}
	}
}
