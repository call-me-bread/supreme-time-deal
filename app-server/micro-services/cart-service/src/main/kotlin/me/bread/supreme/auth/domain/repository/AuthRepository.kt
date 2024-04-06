package me.bread.supreme.auth.domain.repository

import me.bread.supreme.auth.domain.entity.Auth

interface AuthRepository {
	fun findByEmail(email: String): Auth?

	fun save(auth: Auth)
}
