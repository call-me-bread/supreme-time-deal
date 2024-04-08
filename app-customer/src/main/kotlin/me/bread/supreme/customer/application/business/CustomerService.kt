package me.bread.supreme.customer.application.business

import me.bread.supreme.customer.application.CustomerInfo
import me.bread.supreme.customer.application.implementation.CustomerAppender
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CustomerService(
	private val customerAppender: CustomerAppender,
) {
	@Transactional
	fun register(customerInfo: CustomerInfo) {
		customerAppender.create(customerInfo.entity())
	}
}
