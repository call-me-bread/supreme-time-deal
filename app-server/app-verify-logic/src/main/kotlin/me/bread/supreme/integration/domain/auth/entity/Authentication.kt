package me.bread.supreme.integration.domain.auth.entity

import me.bread.supreme.integration.domain.auth.vo.Email
import me.bread.supreme.integration.domain.auth.vo.Password
import me.bread.supreme.integration.domain.auth.vo.PhoneNumber

data class Authentication(
	val email: Email,
	val password: Password,
	val phoneNumber: PhoneNumber,
) {


}
