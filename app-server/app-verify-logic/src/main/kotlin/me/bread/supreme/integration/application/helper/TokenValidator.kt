package me.bread.supreme.integration.application.helper

interface TokenValidator {
	enum class CheckResult {
		SUCCESS,
		FAIL
	}

	fun check(token: String): CheckResult
}
