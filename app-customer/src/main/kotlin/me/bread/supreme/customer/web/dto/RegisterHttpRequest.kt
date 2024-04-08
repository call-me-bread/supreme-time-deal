package me.bread.supreme.customer.web.dto

import me.bread.supreme.customer.application.CustomerInfo

data class RegisterHttpRequest(
	val nickname: String,
) {
	fun meaningful() = CustomerInfo(nickname)
}
