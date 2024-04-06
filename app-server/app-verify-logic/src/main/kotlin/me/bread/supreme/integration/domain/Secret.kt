package me.bread.supreme.integration.domain

import java.time.LocalDateTime

class Secret(
	val email: String,
	val password: String,
	val phoneNumber: String,
	val phoneAuth: Boolean,
	val createdAt: LocalDateTime = LocalDateTime.now(),
	val updatedAt: LocalDateTime = LocalDateTime.now(),
) {
	fun phoneAuth(): Boolean {
		return this.phoneAuth
	}
}
