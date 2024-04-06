package me.bread.supreme.auth.storage

import me.bread.supreme.auth.domain.entity.Auth
import me.bread.supreme.auth.domain.repository.AuthRepository
import org.springframework.data.jpa.repository.JpaRepository

interface JpaAuthRepository : AuthRepository, JpaRepository<Auth, Long> {
	override fun findByEmail(email: String): Auth?
}
