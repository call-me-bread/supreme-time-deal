package me.bread.supreme.auth.domain.repository

import me.bread.supreme.auth.domain.Secret

interface SecretRepository {
	fun findByEmail(email: String): Secret?
}
