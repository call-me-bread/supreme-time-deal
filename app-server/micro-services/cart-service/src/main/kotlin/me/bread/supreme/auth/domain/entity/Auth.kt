package me.bread.supreme.auth.domain.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Table(name = "customer_secret")
class Auth(
	val email: String,
	val passwordHash: String,
	val isBlock: Boolean = false,
	val createdAt: LocalDateTime = LocalDateTime.now(),
)
