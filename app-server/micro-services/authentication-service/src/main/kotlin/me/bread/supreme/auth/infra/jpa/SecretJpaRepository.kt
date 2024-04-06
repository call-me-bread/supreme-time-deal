package me.bread.supreme.auth.infra.jpa

import me.bread.supreme.auth.domain.Secret
import me.bread.supreme.auth.domain.repository.SecretRepository
import org.springframework.data.jpa.repository.JpaRepository

interface SecretJpaRepository : JpaRepository<Secret, Long>, SecretRepository {
	override fun findByEmail(email: String): Secret?
}
