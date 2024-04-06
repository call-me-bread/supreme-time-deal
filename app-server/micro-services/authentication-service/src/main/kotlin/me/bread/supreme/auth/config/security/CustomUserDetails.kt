package me.bread.supreme.auth.config.security

import me.bread.supreme.auth.domain.Secret
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(
	private val secret: Secret,
) : UserDetails {
	fun getPasswordCredential(): Secret {
		return secret
	}

	override fun getPassword(): String {
		return secret.password
	}

	override fun getUsername(): String {
		return secret.email
	}

	override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
		return mutableListOf(
			SimpleGrantedAuthority(secret.auth.role.toString()),
		)
	}

	override fun isAccountNonExpired(): Boolean {
		return true
	}

	override fun isAccountNonLocked(): Boolean {
		return true
	}

	override fun isCredentialsNonExpired(): Boolean {
		return true
	}

	override fun isEnabled(): Boolean {
		return true
	}
}
