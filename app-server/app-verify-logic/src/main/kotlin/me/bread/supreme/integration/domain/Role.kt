package me.bread.supreme.integration.domain

enum class Role(private val authority: String) {
	USER("USER"),
	ADMIN("ADMIN"),
	;

	override fun toString(): String {
		return authority
	}
}
