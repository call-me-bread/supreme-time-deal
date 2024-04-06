package me.bread.supreme.auth.domain

enum class Role(private val authority: String) {
	USER("USER"),
	ADMIN("ADMIN"),
	;

	override fun toString(): String {
		return authority
	}
}
