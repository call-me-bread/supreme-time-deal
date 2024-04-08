package me.bread.supreme.integration.domain.auth.validatior

interface TokenValidator {
	enum class CheckResult {
		SUCCESS,
		FAIL
	}

	fun check(token: String): CheckResult
}
