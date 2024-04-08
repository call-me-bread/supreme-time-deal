package me.bread.supreme.integration.domain.auth.vo

import me.bread.supreme.integration.domain.auth.exception.InvalidFormatEmailException

@JvmInline
value class Email(
	private val value: String
) {
	init {
		if (
			this.value.isBlank() ||
			!this.value.contains("@") ||
			!this.value.contains(".")
		) throw InvalidFormatEmailException()
	}
}

