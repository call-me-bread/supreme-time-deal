package me.bread.supreme.auth.domain

import jakarta.persistence.*
import java.time.LocalDateTime

class Secret(
	val id: Long? = null,
	val email: String,
	val password: String,
	@JoinColumn(name = "id")
	val auth: Auth,
	val createdAt: LocalDateTime = LocalDateTime.now(),
	val updatedAt: LocalDateTime = LocalDateTime.now(),
)
