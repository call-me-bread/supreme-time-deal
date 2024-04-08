package me.bread.supreme.integration.domain.authorization.entity

import me.bread.supreme.integration.domain.authorization.vo.Email
import me.bread.supreme.integration.domain.authorization.vo.Password
import me.bread.supreme.integration.domain.authorization.vo.PhoneNumber

data class Authentication(
	val email: Email,
	val password: Password,
	val phoneNumber: PhoneNumber,
) {


}
